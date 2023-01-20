interface taskConfigInterface{
    name: {
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean,
    },
    status: {
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean,
        icon: string
    },
    label: {
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean,
        icon: string
    },
    description:{
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean,
    },
    assignee:{
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean,
        icon: string
    },
    organisation?: string
}

export default taskConfigInterface;