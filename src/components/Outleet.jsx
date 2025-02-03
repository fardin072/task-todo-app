import React from 'react';
import { Outlet } from 'react-router-dom';

const Outleet = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default Outleet;