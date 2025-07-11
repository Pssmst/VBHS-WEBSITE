export function newElement(
    tag, parent, {
        // now “text” can include HTML tags
        text = null,
        id = null,
        classes = null,
        href = null,
        src = null,
        width = null,
        height = null,
        frameborder = null,
        allowfullscreen = null,
    } = {}
) {
    const e = document.createElement(tag);
    // Basic attributes
    if (id != null) e.id = id;
    if (href != null) e.href = href;
    if (src != null) e.src = src;
    if (width != null) e.width = width;
    if (height != null) e.height = height;
    if (frameborder != null) e.setAttribute('frameborder', frameborder);
    if (allowfullscreen === true) e.allowFullscreen = true;

    // CSS classes
    if (classes != null) {
        for (const cls of classes) {
            e.classList.add(cls);
        }
    }

    // Render "ext as HTML (if provided)
    if (text != null) e.innerHTML = text;

    // Append to parent
    const parentEl = parent === "body"
        ? document.body
        : document.getElementById(parent);

    if (!parentEl) {
        console.error(`newElement: no parent element with id="${parent}"`);
        return;
    }
    parentEl.appendChild(e);
}
