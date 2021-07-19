export const mockComponent = (name: string, props: any, stringifyProps = true) => {
    const { children, ...restOfProps } = props;
    return (
        <code
            aria-label={name}
            aria-props={
                stringifyProps
                ? JSON.stringify(restOfProps).replace(/"/g, "'")
                : restOfProps
            }
        >
        {children}
        </code>
    );
};