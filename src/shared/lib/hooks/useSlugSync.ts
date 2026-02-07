import {useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {generatePath, useNavigate, useParams} from "react-router"

import type {SupportedLngsType} from "@/shared/config"

interface UseSlugSyncArgs {
    languageParam?: SupportedLngsType
    slugMap?: Record<SupportedLngsType, string>
    enabled: boolean
    routePath: string
    slugParamName?: string
}

export const useSlugSync = ({
                                languageParam,
                                slugMap,
                                enabled,
                                routePath,
                                slugParamName = 'slug'
                            }: UseSlugSyncArgs) => {
    const navigate = useNavigate()
    const {i18n} = useTranslation()
    const params = useParams()
    const currentSlug = params[slugParamName]

    const previousSlugRef = useRef(currentSlug)

    useEffect(() => {
        if (languageParam && i18n.language !== languageParam) {
            void i18n.changeLanguage(languageParam)
        }
    }, [languageParam, i18n])

    useEffect(() => {
        if (!enabled || !slugMap) return

        const currentLanguage = i18n.language as SupportedLngsType
        const correctSlug = slugMap[currentLanguage]

        const slugChanged = currentSlug !== previousSlugRef.current

        if (slugChanged) {
            previousSlugRef.current = currentSlug
            return
        }

        const slugMatchesUrl = Object.values(slugMap).includes(currentSlug || '')

        if (!slugMatchesUrl) {
            return
        }

        const needsUpdate =
            correctSlug &&
            (correctSlug !== currentSlug || currentLanguage !== languageParam)

        if (needsUpdate) {
            const path = generatePath(routePath, {
                lng: currentLanguage,
                [slugParamName]: correctSlug
            })
            navigate(path, {replace: true})
        }
    }, [enabled, slugMap, i18n.language, currentSlug, languageParam, navigate, routePath, slugParamName])
}