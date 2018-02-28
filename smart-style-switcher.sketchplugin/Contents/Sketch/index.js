          var onRun = function(context) {
          /*@import "/repos/@hisco/sketch-SK/SK.js";
@import "/repos/@hisco/sketch-smart-style-switcher/index.js";

const device = "TH";
const name = "TARJETA-DIGITAL";
const x = `${device}/VIS-${device}-${name}-`
*/
 // @format

/*
  verticalAlignment: layer.textAlignment(),
  textAlignment: layer.textAlignment(),
  textTransform: layer.styleAttributes()["MSAttributedStringTextTransformAttribute"],
  strinke: layer.styleAttributes()["NSStrikethrough"],
  underline: layer.styleAttributes()["NSUnderline"]
  */

function pasteInstanceSharedStyle(layer, sharedStyle) {
  return (layer.style = sharedStyle.newInstance());
}

function msg(msg) {
  context.document.showMessage(msg);
}

function compareObjects(o1, o2) {
  for (var p in o1) {
    if (o1.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  for (var p in o2) {
    if (o2.hasOwnProperty(p)) {
      if (o1[p] !== o2[p]) {
        return false;
      }
    }
  }
  return true;
}

function getAllTextSharedStyles() {
  return context.document
    .documentData()
    .layerTextStyles()
    .objects()
    .slice();
}

function listTextLayerAttrs(layer) {
  const attrs = layer.attributedString().treeAsDictionary().value.attributes[0];
  return {
    color: attrs.MSAttributedStringColorAttribute.value + "",
    nsfont: attrs.NSFont.attributes.NSFontNameAttribute + "",
    fontSize: attrs.NSFont.attributes.NSFontSizeAttribute + "",
    family: attrs.NSFont.family + "",
    name: attrs.NSFont.name + "",
    kerning: attrs.NSKern + "",
    alignment: attrs.NSParagraphStyle.style.alignment + "",
    lineHeight: attrs.NSParagraphStyle.style.maximumLineHeight + "",
    parapgrah: attrs.NSParagraphStyle.style.paragraphSpacing + ""
  };
}

function listTextLayerAttrsFromStyle(layerStyle) {
  const attrs = layerStyle
    .style()
    .primitiveTextStyle()
    .attributes()
    .treeAsDictionary();

  const nsfont = attrs.NSFont;
  const nsparagraph = attrs.NSParagraphStyle;

  return {
    color: attrs.MSAttributedStringColorAttribute.value + "",
    nsfont: nsfont.attributes.NSFontNameAttribute + "",
    fontSize: nsfont.attributes.NSFontSizeAttribute + "",
    family: nsfont.family + "",
    name: nsfont.name + "",
    kerning: attrs.NSKern + "",
    alignment: nsparagraph.style.alignment + "",
    lineHeight: nsparagraph.style.maximumLineHeight + "",
    parapgrah: nsparagraph.style.paragraphSpacing + ""
  };
}

const SEL = context.selection.slice();
const ALL_LAYERS_STYLE = getAllTextSharedStyles();

context.selection.forEach(function(layer) {
  const layerStyle = listTextLayerAttrs(layer);

  let findMSSharedStyleFromLayer = null;
  ALL_LAYERS_STYLE.forEach(function(style) {
    const a = listTextLayerAttrsFromStyle(style);
    if (compareObjects(a, layerStyle)) {
      findMSSharedStyleFromLayer = style;
      return 1;
    }
  });

  if (findMSSharedStyleFromLayer != null) {
    const MSSharedStyle = findMSSharedStyleFromLayer;
    pasteInstanceSharedStyle(layer, MSSharedStyle);
    msg("🤟 Estilo aplicado!");
  } else {
    msg("😱 Estilo no encontrado");
  }
});

context.document.reloadInspector();

          };
          