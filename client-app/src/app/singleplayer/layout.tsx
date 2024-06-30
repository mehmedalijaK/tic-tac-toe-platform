import { ReactNode } from "react";

interface Props {
    children?: ReactNode
}

const SingeplayerLayout = ({children}: Props) => {
    return(
        <div>
            {children}
        </div>
    )
}

export default SingeplayerLayout