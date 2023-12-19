export interface mozillaResponse {
    title: string,
    url: string,
    author: string,
    authorURL: string,
    imageURL: string,
    metaData: Object[],
    ratings: Object[],
    images: string[],
    description: string,
    permissions: string[],
    homePage: string | null,
    supportEmail: string | null,
    supportLink: string | null,
    version: string,
    size: string,
    lastUpdated: string,
    categories: CategoryTagInterface[],
    license: string,
    tags: CategoryTagInterface[],
}

export interface CategoryTagInterface {
    name: string,
    url: string,
}