import React from "react";
import Sidebar from "src/share/sidebar/Sidebar";

import "src/share/base/Base.scss";

type Props = {
    component: any;
};

const Base: React.FC<Props> = (props: Props) => {
    const { component } = props;
    return (
        <>
            <Sidebar />
            <div className="content-field">{component}</div>
        </>
    );
};

export default Base;
