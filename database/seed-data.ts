

interface SeedData {
    entries: SeedEntry[];
}

interface SeedEntry {
    description: string;
    status: string;
    createdAt: number;
}




export const seedData: SeedData = {
    entries: [
        {
            description: 'Pendiente: Descripcion de una entrada 1',
            status: 'pending',
            createdAt: Date.now(),
        },
        {
            description: 'En progreso: Descripcion de una entrada 2',
            status: 'in-progress',
            createdAt: Date.now() - 1000000,
        },
        {
            description: 'Finalizada: Descripcion de una entrada 3',
            status: 'finished',
            createdAt: Date.now() - 100000,
        },
    ]
}