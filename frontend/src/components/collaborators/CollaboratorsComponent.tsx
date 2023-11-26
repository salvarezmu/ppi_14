import React from "react";
import './CollaboratorsComponent.css';
import SA_image from '../../assets/SA.jpg';
import OZ_image from '../../assets/OZ.jpeg';
import RN_image from '../../assets/RN.png';

type Collaborator = {
    image: string;
    github_nickname: string;
    github_url: string;
}

export class CollaboratorsComponent extends React.Component {

    private readonly collaborators: Array<Collaborator> = [
        {
            image: SA_image,
            github_nickname: 'salvarezmu',
            github_url: 'https://github.com/salvarezmu',
        },
        {
            image: OZ_image,
            github_nickname: 'oazambranoa',
            github_url: 'https://github.com/oazambranoa',
        },
        {
            image: RN_image,
            github_nickname: 'russbelln',
            github_url: 'https://github.com/russbelln',
        },
    ];

    render() {
        return (
            <div className={"collaborators-container"}>
                {this.collaborators.map(c => {
                    return (
                        <div className={"collaborator"} key={c.github_nickname}>
                            <a href={c.github_url}>
                                <img src={c.image} title={c.github_nickname} className={"collaborator-image"}/>
                            </a>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default CollaboratorsComponent;