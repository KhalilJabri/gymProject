import React from "react"
import {RiTeamFill} from "react-icons/ri"
import {GiMuscleUp} from "react-icons/gi"
import {TbReportAnalytics, TbPointFilled} from "react-icons/tb"


export const superAdminElements = [
    {
        title: 'Dashboards',
        links: [
            {
                name: 'Data Visualization',
                icon: <TbReportAnalytics/>,
            },
            
        ],
    },

    {
        title: 'Pages',
        links: [
            {
                name: 'Employees',
                icon: <RiTeamFill/>
            },
            {
                name: 'Coaches',
                icon: <GiMuscleUp/>
            },
            {
                name: 'Subscribers',
                icon: <GiMuscleUp/>,
                list:[
                    {
                        name: 'bodybuilding',
                        icon: <TbPointFilled/>,
                    },
                    {
                        name: 'box',
                        icon: <TbPointFilled/>,
                    },
                    {
                        name: 'taekwondo',
                        icon: <TbPointFilled/>,
                    },
                    {
                        name: 'judo',
                        icon: <TbPointFilled/>,
                    },
                    {
                        name: 'gymnastic',
                        icon: <TbPointFilled/>,
                    },
                ]
            },
        ],
    },
];

