export class Page {
    uuid: string
    text: string
}

export class PageQuery {
    data: {
        pages: [Page]
    }
}