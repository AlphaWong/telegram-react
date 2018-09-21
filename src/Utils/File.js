import {getPhotoSize} from "./Common";
import UserStore from "../Stores/UserStore";

function getChatPhoto(chat) {
    if (chat['@type'] !== 'chat') {
        return [0, '', ''];
    }

    return getSmallPhoto(chat.photo);
}

function getUserPhoto(user) {
    if (user['@type'] !== 'user') {
        return [0, '', ''];
    }

    return getSmallPhoto(user.profile_photo);
}

function getSmallPhoto(photo){

    if (photo && photo.small && photo.small.remote){
        return [photo.small.id, photo.small.remote.id, photo.small.idb_key];
    }

    return [0, '', ''];
}

function getStickerFile(message) {
    if (message['@type'] !== 'message') {
        return [0, '', ''];
    }

    if (!message.content || message.content['@type'] !== 'messageSticker'){
        return [0, '', ''];
    }

    if (message.content.sticker) {
        let file = message.content.sticker.sticker;
        if (file && file.remote.id) {
            return [file.id, file.remote.id, file.idb_key];
        }
    }

    return [0, '', ''];
}

function getDocumentThumbnailFile(message) {
    if (message['@type'] !== 'message') {
        return [0, '', ''];
    }

    if (!message.content || message.content['@type'] !== 'messageDocument'){
        return [0, '', ''];
    }

    let document = message.content.document;
    if (!document){
        return [0, '', ''];
    }

    let thumbnail = document.thumbnail;
    if (!thumbnail){
        return [0, '', ''];
    }

    if (thumbnail.photo) {
        let file = thumbnail.photo;
        if (file && file.remote.id) {
            return [file.id, file.remote.id, file.idb_key];
        }
    }

    return [0, '', ''];
}

function getPhotoPreviewFile(message) {
    if (message['@type'] !== 'message') {
        return [0, '', ''];
    }

    if (!message.content || message.content['@type'] !== 'messagePhoto'){
        return [0, '', ''];
    }

    if (message.content.photo) {
        let photoSize = getPreviewPhotoSize(message.content.photo.sizes);
        if (photoSize && photoSize['@type'] === 'photoSize'){
            let file = photoSize.photo;
            if (file && file.remote.id) {
                return [file.id, file.remote.id, file.idb_key];
            }
        }
    }

    return [0, '', ''];
}

function getPhotoFile(message) {
    if (message['@type'] !== 'message') {
        return [0, '', ''];
    }

    if (!message.content || message.content['@type'] !== 'messagePhoto'){
        return [0, '', ''];
    }

    if (message.content.photo) {
        let photoSize = getPhotoSize(message.content.photo.sizes);
        if (photoSize && photoSize['@type'] === 'photoSize'){
            let file = photoSize.photo;
            if (file && file.remote.id) {
                return [file.id, file.remote.id, file.idb_key];
            }
        }
    }

    return [0, '', ''];
}

function getContactFile(message) {
    if (message['@type'] !== 'message') {
        return [0, '', ''];
    }

    if (!message.content || message.content['@type'] !== 'messageContact'){
        return [0, '', ''];
    }

    if (message.content.contact && message.content.contact.user_id > 0) {
        let user = UserStore.get(message.content.contact.user_id);
        if (user){
            return getUserPhoto(user);
        }
    }

    return [0, '', ''];
}

function getPreviewPhotoSize(sizes){
    return sizes.length > 0 ? sizes[0] : null;
}

function saveData(data, filename, mime) {
    var blob = new Blob([data], {type: mime || 'application/octet-stream'});
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var blobURL = window.URL.createObjectURL(blob);
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename);

        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
    }
}

function saveBlob(blob, filename) {
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
        // IE workaround for "HTML7007: One or more blob URLs were
        // revoked by closing the blob for which they were created.
        // These URLs will no longer resolve as the data backing
        // the URL has been freed."
        window.navigator.msSaveBlob(blob, filename);
    }
    else {
        var blobURL = window.URL.createObjectURL(blob);
        var tempLink = document.createElement('a');
        tempLink.style.display = 'none';
        tempLink.href = blobURL;
        tempLink.setAttribute('download', filename);

        // Safari thinks _blank anchor are pop ups. We only want to set _blank
        // target if the browser does not support the HTML5 download attribute.
        // This allows you to download files in desktop safari if pop up blocking
        // is enabled.
        if (typeof tempLink.download === 'undefined') {
            tempLink.setAttribute('target', '_blank');
        }

        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobURL);
    }
}

export {
    getUserPhoto,
    getChatPhoto,
    getContactFile,
    getStickerFile,
    getPhotoFile,
    getPhotoPreviewFile,
    getDocumentThumbnailFile,
    saveData,
    saveBlob,
};