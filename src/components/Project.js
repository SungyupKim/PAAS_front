import React, { Component } from 'react'
import axios from 'axios';
import { useKeycloak } from "@react-keycloak/web";
import resourcesReducer, { clickReducer }  from "./State.js"
import '../App.css'
import ProjectResources from './ProjectResources.js';

const Projects = () => {
    const projectUrl = 'http://localhost:1234/projects'/*{'http://192.168.219.3/projects'}*/

    const { keycloak, initialized } = useKeycloak();

    const [projects, dispatchProjects] = React.useReducer(
        resourcesReducer, { data: [], isLoading: false, isError: false }
    );

    const handleFetchProjects = React.useCallback(async () => {
        dispatchProjects({ type: 'RESOURCES_FETCH_INIT' });
        try {
            const result = await axios.get(projectUrl, { headers: { 'Authorization': 'Bearer ' + keycloak.token } });

            console.log(result.data.projects)
            dispatchProjects({
                type: 'RESOURCES_FETCH_SUCCESS',
                payload: result.data.projects,
            });

        } catch {
            dispatchProjects({ type: 'RESOURCES_FETCH_FAILURE' });
        }
    }, [projectUrl]);
    React.useEffect(() => {
        handleFetchProjects();
    }, [initialized]);

    const [projectResource, dispatchClickResources] = React.useReducer(
        clickReducer, { isInit: true, isClicked: false }
    );

    return (
        <div>
            {
                projects.isLoading ? (<p>Loading ... </p>
                ) : (
                    <List list={projects.data} clicked={projectResource.isClicked} dispatcher={dispatchClickResources}/>
                )
            }
        </div>
    );
}

const List = React.memo(({ list, clicked, dispatcher}) =>
    list.map(project => (
        <Project
            key={project.objectID}
            project={project}
            isSomethingClicked={clicked}
            clickCallback={dispatcher}
        />
    ))
);

class Project extends Component {
    constructor({ project, clickCallback}) {
        super()
        this.project = project
        this.onClick = clickCallback
        this.state = {
            isClicked: false,
        }
        this._onButtonClick = this._onButtonClick.bind(this);
    }

    _onButtonClick() {
        this.onClick({ type: 'RESOURCES_CLICKED' });
        console.log('click!!!')
        this.setState({
            isClicked: true,
        });
    }

    render() {
        return this.state.isClicked ? <div><ProjectResources projectId={this.project.projectId} /></div> : this.props.isSomethingClicked ? null : (<div class="project" style={{ width: '100%' }}>
            <span style={{ width: '50%' }}>{this.project.projectId}</span>
            <span style={{ width: '30%' }}>{this.project.name}</span>
            <span style={{ width: '10%' }}>
                <button type="button" onClick={this._onButtonClick}>
                    projectResources
                </button>
            </span>    </div>)
    }
}

export default Projects;