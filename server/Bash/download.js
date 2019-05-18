const vid = document.getElementsByTagName('video');
if (vid
    && typeof vid[0] !== 'undefined'
    && typeof vid[0].src === 'string') {
    const el = document.createElement('textarea');
    el.value = vid[0].src;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    console.info('URL copied!!!');
} else {
    console.error('Error: extracting URL failed');
}
