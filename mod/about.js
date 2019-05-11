var medicine;
//#region
var medicinebasic = (basic) => /*html*/`<!DOCTYPE html>
<head>
    <title>About NodeSnapWeb</title>
    <link rel="stylesheet" href="https://teamfirework.github.io/endo/endo.css" /><!--TODO: add endo.css-->
    <meta name="viewport" content="width:device-width">
    <style>
        :root {
            --endo-theme--primary: #ff3333;
            --endo-theme--on-primary: #000;
            --endo-theme--background: #111;
            --endo-theme--on-background: #fff;
            --endo-theme--surface: #454545;
            --endo-theme--on-surface: #fff;
        }
        div.nsw-surface {
            background: #454545;
            background: var(--endo-theme--surface, #454545);
            color: #fff;
            margin: 32px 128px;
            height: 85vh;
        }
        div.nsw-surface .nsw-header {
            background: #ff3333;
            background: var(--endo-theme--primary, #ff3333);
            color: #000;
            color: var(--endo-theme--on-primary, #000);
            font-size: x-large;
            font-weight: bold;
            margin:0;
        }
        .nsw-content {
            padding:16px;
        }
    </style>
    <!--TODO: add endo customizations-->
</head>
<body>
    <div class="nsw-surface">
        <div class="nsw-header">About This NodeSnapWeb Server</div>
        <div class="nsw-content">Yeti yeti yeti...</div>
    </div>
</body>`;
//#endregion

module.exports.doGet = function (basictotal) {
    return medicinebasic(basictotal);
}