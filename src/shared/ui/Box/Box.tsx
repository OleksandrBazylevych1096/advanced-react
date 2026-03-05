import type {ComponentPropsWithoutRef, CSSProperties, ElementType} from "react";

import type {StackSpace} from "../Stack/Stack";

interface BoxOwnProps {
    p?: StackSpace;
    px?: StackSpace;
    py?: StackSpace;
    pt?: StackSpace;
    pr?: StackSpace;
    pb?: StackSpace;
    pl?: StackSpace;
    m?: StackSpace;
    mx?: StackSpace;
    my?: StackSpace;
    mt?: StackSpace;
    mr?: StackSpace;
    mb?: StackSpace;
    ml?: StackSpace;
}

const px = (v?: StackSpace) => (v !== undefined ? `${v}px` : undefined);

type PolymorphicProps<C extends ElementType> = BoxOwnProps & {
    as?: C;
} & Omit<ComponentPropsWithoutRef<C>, keyof BoxOwnProps | "as">;

export const Box = <C extends ElementType = "div">({
    as,
    style,
    children,
    className,
    ...props
}: PolymorphicProps<C>) => {
    const {p, px: pX, py, pt, pr, pb, pl, m, mx, my, mt, mr, mb, ml, ...rest} = props;

    const boxStyle: CSSProperties = {
        ...(p !== undefined && {padding: px(p)}),
        ...(m !== undefined && {margin: px(m)}),
        ...(pX !== undefined && {paddingLeft: px(pX), paddingRight: px(pX)}),
        ...(py !== undefined && {paddingTop: px(py), paddingBottom: px(py)}),
        ...(mx !== undefined && {marginLeft: px(mx), marginRight: px(mx)}),
        ...(my !== undefined && {marginTop: px(my), marginBottom: px(my)}),
        ...(pt !== undefined && {paddingTop: px(pt)}),
        ...(pr !== undefined && {paddingRight: px(pr)}),
        ...(pb !== undefined && {paddingBottom: px(pb)}),
        ...(pl !== undefined && {paddingLeft: px(pl)}),
        ...(mt !== undefined && {marginTop: px(mt)}),
        ...(mr !== undefined && {marginRight: px(mr)}),
        ...(mb !== undefined && {marginBottom: px(mb)}),
        ...(ml !== undefined && {marginLeft: px(ml)}),
        ...style,
    };

    const Component = as ?? "div";

    return (
        <Component className={className} style={boxStyle} {...rest}>
            {children}
        </Component>
    );
};
