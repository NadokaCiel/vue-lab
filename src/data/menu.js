export default [{
    name: "Home",
    icon: "fa fa-fw fa-home",
    route: "Home",
}, {
    name: "My Lab",
    icon: "fa fa-fw fa-puzzle-piece",
    route: "Lab",
    sub: [{
        name: "Button",
        icon: "fa fa-fw fa-square",
        route: "Button",
    }, {
        name: "Linkup",
        icon: "fa fa-fw fa-random",
        route: "Linkup",
    }, {
        name: "Traversal",
        icon: "fa fa-fw fa-superpowers",
        route: "Traversal",
    }, {
        name: "Chess",
        icon: "fa fa-fw fa-street-view",
        route: "Chess",
    }]
}, {
    name: "My Article",
    icon: "fa fa-fw fa-pencil",
    route: "Article",
    sub: [{
        name: "List",
        icon: "fa fa-fw fa-list",
        route: "ArticleList",
    }]
}]
