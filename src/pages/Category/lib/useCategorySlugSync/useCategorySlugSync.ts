import {useEffect, useRef} from 'react'
import {useTranslation} from 'react-i18next'
import {generatePath, useNavigate, useParams} from "react-router"

import type {Category} from "@/entities/category"

import {routePaths, type SupportedLngsType} from "@/shared/config"

interface Args {
    languageParam?: SupportedLngsType
    category?: Category
    enabled: boolean
}

export const useCategorySlugSync = ({
                                        languageParam,
                                        category,
                                        enabled,
                                    }: Args) => {
    const navigate = useNavigate()
    const {i18n} = useTranslation()
    const {slug: currentSlug} = useParams()

    const previousSlugRef = useRef(currentSlug)

    useEffect(() => {
        if (languageParam && i18n.language !== languageParam) {
            void i18n.changeLanguage(languageParam)
        }
    }, [languageParam, i18n])

    useEffect(() => {
        if (!enabled || !category) return

        const currentLanguage = i18n.language as SupportedLngsType
        const correctSlug = category.slugMap[currentLanguage]

        const slugChanged = currentSlug !== previousSlugRef.current

        if (slugChanged) {
            previousSlugRef.current = currentSlug
            return
        }
        const categoryMatchesUrl = Object.values(category.slugMap).includes(currentSlug || '')

        if (!categoryMatchesUrl) {
            return
        }

        const needsUpdate =
            correctSlug &&
            (correctSlug !== currentSlug || currentLanguage !== languageParam)

        if (needsUpdate) {
            const path = generatePath(routePaths.category, {
                lng: currentLanguage,
                slug: correctSlug
            })
            navigate(path, {replace: true})
        }
    }, [enabled, category, i18n.language, currentSlug, languageParam, navigate])
}