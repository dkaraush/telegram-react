// code has been taken from https://github.com/zhukov/webogram/blob/c5fc5107cad2a476a03d7ce8427f1def41c20568/app/js/lib/ng_utils.js

var nativeWebpSupport = false;
var image = new Image();
image.onload = function() {
    nativeWebpSupport = this.width === 2 && this.height === 1;
};
image.onerror = function() {
    nativeWebpSupport = false;
};
image.src = 'data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==';

export default function() {
    return nativeWebpSupport;
}
