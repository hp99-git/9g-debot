const About = () => {
    const render = () => {
        return (
            <section>
                <div style={{ fontStyle: "italic" }}>
                    <span style={{ verticalAlign: "middle", color: "#add8e6", marginRight: "5px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15.698 7.287 8.712.302a1.03 1.03 0 0 0-1.457 0l-1.45 1.45 1.84 1.84a1.223 1.223 0 0 1 1.55 1.56l1.773 1.774a1.224 1.224 0 0 1 1.267 2.025 1.226 1.226 0 0 1-2.002-1.334L8.58 5.963v4.353a1.226 1.226 0 1 1-1.008-.036V5.887a1.226 1.226 0 0 1-.666-1.608L5.093 2.465l-4.79 4.79a1.03 1.03 0 0 0 0 1.457l6.986 6.986a1.03 1.03 0 0 0 1.457 0l6.953-6.953a1.03 1.03 0 0 0 0-1.457" />
                        </svg>
                    </span>
                    <span>Either use the Tampermonkey installation method to keep this app up to date automatically or manually check for new versions on </span>
                    <a
                        href="https://github.com/hp99-git/9g-debot"
                        target="_blank"
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        GitHub
                    </a>
                    {"."}
                    <hr />
                </div>
                <div class="top-spacing">
                    This application will listen for posts being dynamically loaded by the site. If you initialized this app on an already loaded page, you may need to scroll before you'll see users
                    start to queue.
                </div>
                <div class="top-spacing">
                    Once a post is received, the creator will be:
                    <ol>
                        <li>Compared against your block list. If found, nothing else happens, otherwise:</li>
                        <li>
                            Their posts for the last <strong>5 days</strong> are pulled, and:
                        </li>
                        <li>The number of posts created and the total down votes for those posts will be tallied.</li>
                    </ol>
                </div>
                <div class="top-spacing">
                    <span style={{ verticalAlign: "middle", color: "#add8e6", marginRight: "5px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                        </svg>
                    </span>
                    <cite>If you manually view the creators profile you may notice a mismatch in post counts. This is due to down votes causing posts to be hidden.</cite>
                    <hr />
                </div>
                <div class="top-spacing">As you sort through the data in the &ldquo;Scanned&rdquo; tab, it will be fairly obvious which accounts are likely bots flooding the site with content.</div>
                <div class="top-spacing">
                    <span>Use the </span>
                    <span style={{ verticalAlign: "middle", color: "#FF0000" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M15 8a6.97 6.97 0 0 0-1.71-4.584l-9.874 9.875A7 7 0 0 0 15 8M2.71 12.584l9.874-9.875a7 7 0 0 0-9.874 9.874ZM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0" />
                        </svg>
                    </span>
                    <span> icon to add that user to your block list.</span>
                    <hr />
                </div>
                <div class="top-spacing attention">Scan data is not saved between hard page refreshes! Simply reload the page to clear and start over.</div>
                <div class="top-spacing attention">To remove this app, disable the userscript in Tampermonkey (if you used that installation method) and refresh the page.</div>
            </section>
        );
    };

    return render();
};

export default About;
