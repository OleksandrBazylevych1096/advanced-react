import {useEffect, useRef, useState} from 'react'

type State = {
    isIntersecting: boolean
    entry?: IntersectionObserverEntry
}

type UseIntersectionObserverOptions = {
    root?: Element | Document | null
    rootMargin?: string
    threshold?: number | number[]
    freezeOnceVisible?: boolean
    onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
    initialIsIntersecting?: boolean
}

type IntersectionReturn = [
    (node?: Element | null) => void,
    boolean,
        IntersectionObserverEntry | undefined,
] & {
    ref: (node?: Element | null) => void
    isIntersecting: boolean
    entry?: IntersectionObserverEntry
}

export function useIntersectionObserver({
                                            threshold = 0,
                                            root = null,
                                            rootMargin = '0%',
                                            freezeOnceVisible = false,
                                            initialIsIntersecting = false,
                                            onChange,
                                        }: UseIntersectionObserverOptions = {}): IntersectionReturn {
    const [ref, setRef] = useState<Element | null>(null)

    const [state, setState] = useState<State>(() => ({
        isIntersecting: initialIsIntersecting,
        entry: undefined,
    }))

    const callbackRef = useRef<UseIntersectionObserverOptions['onChange']>(null)

    callbackRef.current = onChange

    const frozen = state.entry?.isIntersecting && freezeOnceVisible

    useEffect(() => {
        if (!ref) return

        if (!('IntersectionObserver' in window)) return

        if (frozen) return

        let unobserve: (() => void) | undefined

        const observer = new IntersectionObserver(
            (entries: IntersectionObserverEntry[]): void => {
                const thresholds = Array.isArray(observer.thresholds)
                    ? observer.thresholds
                    : [observer.thresholds]

                entries.forEach(entry => {
                    const isIntersecting =
                        entry.isIntersecting &&
                        thresholds.some(threshold => entry.intersectionRatio >= threshold)

                    setState({isIntersecting, entry})

                    if (callbackRef.current) {
                        callbackRef.current(isIntersecting, entry)
                    }

                    if (isIntersecting && freezeOnceVisible && unobserve) {
                        unobserve()
                        unobserve = undefined
                    }
                })
            },
            {threshold, root, rootMargin},
        )

        observer.observe(ref)

        return () => {
            observer.disconnect()
        }

    }, [
        ref,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        JSON.stringify(threshold),
        root,
        rootMargin,
        frozen,
        freezeOnceVisible,
    ])

    const prevRef = useRef<Element | null>(null)

    useEffect(() => {
        if (
            !ref &&
            state.entry?.target &&
            !freezeOnceVisible &&
            !frozen &&
            prevRef.current !== state.entry.target
        ) {
            prevRef.current = state.entry.target
            setState({isIntersecting: initialIsIntersecting, entry: undefined})
        }
    }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting])

    const result = [
        setRef,
        state.isIntersecting,
        state.entry,
    ] as IntersectionReturn

    result.ref = result[0]
    result.isIntersecting = result[1]
    result.entry = result[2]

    return result
}