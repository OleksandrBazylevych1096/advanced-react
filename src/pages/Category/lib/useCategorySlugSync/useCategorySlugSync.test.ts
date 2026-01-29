import {renderHook} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'


import {createMockCategory} from "@/entities/category/api/test/mockData.ts";

import {useCategorySlugSync} from './useCategorySlugSync.ts'

const mockNavigate = vi.fn()
let mockSlug = 'electronics'

vi.mock('react-router', () => ({
    useNavigate: () => mockNavigate,
    useParams: () => ({slug: mockSlug}),
    generatePath: (path: string, params: Record<string, string>) => {
        return path.replace(':lng', params.lng).replace(':slug', params.slug)
    }
}))

let mockLanguage = 'en'
const mockChangeLanguage = vi.fn()

vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        i18n: {
            language: mockLanguage,
            changeLanguage: mockChangeLanguage,
        },
    }),
}))

const electronicsCategory = createMockCategory({
    name: 'Electronics',
    slug: 'electronics',
    slugMap: {
        en: 'electronics',
        de: 'elektronika',
    }
})


describe('useCategorySlugSync', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSlug = 'electronics'
        mockLanguage = 'en'
    })

    describe('language sync from URL param', () => {
        it('should change i18n language when languageParam differs from current language', () => {
            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'de',
                    category: electronicsCategory,
                    enabled: true,
                })
            )

            expect(mockChangeLanguage).toHaveBeenCalledWith('de')
        })

        it('should NOT change language when languageParam matches current language', () => {
            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: electronicsCategory,
                    enabled: true,
                })
            )

            expect(mockChangeLanguage).not.toHaveBeenCalled()
        })

        it('should NOT change language when languageParam is undefined', () => {
            renderHook(() =>
                useCategorySlugSync({
                    languageParam: undefined,
                    category: electronicsCategory,
                    enabled: true,
                })
            )

            expect(mockChangeLanguage).not.toHaveBeenCalled()
        })
    })

    describe('URL navigation', () => {
        it('should NOT navigate when enabled is false', () => {
            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: electronicsCategory,
                    enabled: false,
                })
            )

            expect(mockNavigate).not.toHaveBeenCalled()
        })

        it('should NOT navigate when category is undefined', () => {
            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: undefined,
                    enabled: true,
                })
            )

            expect(mockNavigate).not.toHaveBeenCalled()
        })

        it('should NOT navigate when current slug matches correct slug for language', () => {
            mockSlug = 'electronics'
            mockLanguage = 'en'

            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: electronicsCategory,
                    enabled: true,
                })
            )

            expect(mockNavigate).not.toHaveBeenCalled()
        })

        it('should navigate when URL slug does not match the slug for current language', () => {
            mockSlug = 'electronics'
            mockLanguage = 'de'

            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: electronicsCategory,
                    enabled: true,
                })
            )

            expect(mockNavigate).toHaveBeenCalledWith(
                '/de/category/elektronika',
                {replace: true}
            )
        })

        it('should navigate when languageParam differs from current i18n language', () => {
            mockSlug = 'electronics'
            mockLanguage = 'de'

            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: electronicsCategory,
                    enabled: true,
                })
            )

            expect(mockNavigate).toHaveBeenCalledWith(
                '/de/category/elektronika',
                {replace: true}
            )
        })

        it('should NOT navigate when slug is not in category slugMap', () => {
            mockSlug = 'unknown-slug'
            mockLanguage = 'de'

            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: electronicsCategory,
                    enabled: true,
                })
            )

            expect(mockNavigate).not.toHaveBeenCalled()
        })
    })

    describe('slug change detection', () => {
        it('should update previousSlugRef and skip navigation when slug changes', () => {
            mockSlug = 'electronics'
            mockLanguage = 'de'

            const {rerender} = renderHook(
                ({slug}) => {
                    mockSlug = slug
                    return useCategorySlugSync({
                        languageParam: 'de',
                        category: electronicsCategory,
                        enabled: true,
                    })
                },
                {initialProps: {slug: 'electronics'}}
            )

            mockNavigate.mockClear()

            rerender({slug: 'elektronika'})

            expect(mockNavigate).not.toHaveBeenCalled()
        })
    })

    describe('edge cases', () => {
        it('should handle category with missing translation gracefully', () => {
            mockSlug = 'electronics'
            mockLanguage = 'en'

            const categoryWithEmptyTranslation = createMockCategory({
                name: 'Electronics',
                slug: 'electronics',
                slugMap: {
                    en: 'electronics',
                    de: '',
                }
            })

            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: categoryWithEmptyTranslation,
                    enabled: true,
                })
            )

            expect(mockNavigate).not.toHaveBeenCalled()
        })

        it('should work with different category slugs', () => {
            mockSlug = 'clothing'
            mockLanguage = 'de'

            const clothingCategory = createMockCategory({
                name: 'Clothing',
                slug: 'clothing',
                slugMap: {
                    en: 'clothing',
                    de: 'odyag',
                }
            })

            renderHook(() =>
                useCategorySlugSync({
                    languageParam: 'en',
                    category: clothingCategory,
                    enabled: true,
                })
            )

            expect(mockNavigate).toHaveBeenCalledWith(
                '/de/category/odyag',
                {replace: true}
            )
        })
    })
})