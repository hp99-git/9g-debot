const About = () => {
    const render = () => {
        return (
            <section>
                <div>
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
                </div>
                <div class="top-spacing attention">No data is saved between refreshes. Simply reload the page to remove this app or to start over.</div>
            </section>
        );
    };

    return render();
};

export default About;
