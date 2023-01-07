interface taskConfigInterface{
    name: {
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean
    },
    status: {
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean
    },
    label: {
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean
    },
    description:{
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean
    },
    assignee:{
        entityKey: string,
        entityType: string,
        label: string,
        viible: boolean
    },
    organisation?: string
}

export default taskConfigInterface;