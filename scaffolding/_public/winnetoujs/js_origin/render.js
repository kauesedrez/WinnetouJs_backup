const W = new Winnetou();

function render() {
    W.create(
        "div",
        "#app",
        {
            title: "It's works!",
            subtitle: "WinnetouJs Scaffold is helth n' running.",
        },
        { clean: true }
    );
}
