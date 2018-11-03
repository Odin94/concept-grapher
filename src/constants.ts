export default {
    DEFAULT_FONT: { fontFamily: 'Arial', fontSize: 24, fill: 'black' },
    DEFAULT_GRAPH_STORAGE_PATH: "stored_graphs",
    DEFAULT_STORED_GRAPH_NAME: "graph.json",
    DEFAULT_LINE_STYLE: [/* width */ 2, /* color: */ 0xD5402B, /* alpha: */ 1],

    DEFAULT_NODE_BACKGROUND: {
        color: 0x282d36, alpha: 0.8
    },
    NODE_BACKGROUND_MARGIN: 25,

    SELECTED_NODE_OUTLINE_STYLE: [/* width */ 5, /* color: */ 0xD5402B, /* alpha: */ 1],

    Z_ORDERS: {
        NODE_TEXT: 10,
        NODE_OUTLINE: 8,
        NODE_BACKGROUND: 7,
        CONNECTION: 2
    },
};