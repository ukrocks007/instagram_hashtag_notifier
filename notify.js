var download = require('download-file')
let notifier = require('node-notifier');
const path = require('path');
var fs = require('fs');
const notify = (data, hashTag) => {
    let id = (+new Date()).toString();
    var options = {
        directory: "./temp/",
        filename: id
    }
    download(data.display_resources[0].src, options, function (err) {
        if (err) throw err
        url = "https://www.instagram.com/p/" + data.shortcode + '/';
        setTimeout(() => {
            fs.unlink(path.join(__dirname, '/temp/' + id), () => {
                console.log("garbage collected!!");
            });
        }, 7000)
        let nc = new notifier.NotificationCenter();
        notifier.notify(
            {
                title: 'New Post for #' + hashTag,
                message: data.text || "New Post",
                icon: path.join(__dirname, '/temp/' + id),
                subtitle: data.edge_media_to_caption.edges ? data.edge_media_to_caption.edges.length > 0 ?
                    data.edge_media_to_caption.edges[0].node ? data.edge_media_to_caption.edges[0].node.text : "" : "" : "",
                contentImage: path.join(__dirname, '/temp/' + id),
                sound: 'Funk', // Only Notification Center or Windows Toasters
                wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                open: url
            },
            function (err, response) {
                // Response is response from notification
            }
        );
    })
};

module.exports = {
    notify,
}