// @format
//
// verticalAlignment: layer.textAlignment(), textAlignment:
// layer.textAlignment(), textTransform:
// layer.styleAttributes()["MSAttributedStringTextTransformAttribute"], strinke:
// layer.styleAttributes()["NSStrikethrough"], underline:
// layer.styleAttributes()["NSUnderline"]

function pasteInstanceSharedStyle(layer, sharedStyle) {
  return (layer.style = sharedStyle.newInstance());
}

function msg(context, msg) {
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

function checkIfStyleHasChanged(layer) {
  const a = listTextLayerAttrs(layer);
  const b = listTextLayerAttrsFromStyle(layer.sharedObject());
  return !compareObjects(a, b);
}

function getAllTextSharedStyles(context) {
  return context.document
    .documentData()
    .layerTextStyles()
    .objects();
}

function listTextLayerAttrs(layer) {
  const attrs = layer.attributedString().treeAsDictionary().value.attributes[0];

  let tt;
  try {
    tt =
      layer
        .style()
        .textStyle()
        .encodedAttributes().MSAttributedStringTextTransformAttribute + "";
  } catch (error) {
    tt = null;
  }

  return {
    color: attrs.MSAttributedStringColorAttribute.value + "",
    nsfont: attrs.NSFont.attributes.NSFontNameAttribute + "",
    fontSize: attrs.NSFont.attributes.NSFontSizeAttribute + "",
    family: attrs.NSFont.family + "",
    name: attrs.NSFont.name + "",
    kerning: attrs.NSKern + "",
    alignment: attrs.NSParagraphStyle.style.alignment + "",
    lineHeight: attrs.NSParagraphStyle.style.maximumLineHeight + "",
    parapgrah: attrs.NSParagraphStyle.style.paragraphSpacing + "",
    va:
      layer
        .style()
        .textStyle()
        .verticalAlignment() + "",
    tt: tt
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

  let tt;
  try {
    tt =
      layerStyle
        .value()
        .textStyle()
        .encodedAttributes().MSAttributedStringTextTransformAttribute + "";
  } catch (error) {
    tt = null;
  }

  return {
    color: attrs.MSAttributedStringColorAttribute.value + "",
    nsfont: nsfont.attributes.NSFontNameAttribute + "",
    fontSize: nsfont.attributes.NSFontSizeAttribute + "",
    family: nsfont.family + "",
    name: nsfont.name + "",
    kerning: attrs.NSKern + "",
    alignment: nsparagraph.style.alignment + "",
    lineHeight: nsparagraph.style.maximumLineHeight + "",
    parapgrah: nsparagraph.style.paragraphSpacing + "",
    va:
      layerStyle
        .value()
        .textStyle()
        .verticalAlignment() + "",
    tt: tt
  };
}

function change(context) {
  const selectedLayers = context.selection;
  const documentLayerSharedStyles = getAllTextSharedStyles(context);

  selectedLayers.forEach(function(layer) {
    const layerStyle = listTextLayerAttrs(layer);
    let findMSSharedStyleFromLayer = null;
    documentLayerSharedStyles.forEach(function(style) {
      const a = listTextLayerAttrsFromStyle(style);
      if (compareObjects(a, layerStyle)) {
        findMSSharedStyleFromLayer = style;
        return true;
      }
    });

    if (findMSSharedStyleFromLayer != null) {
      const MSSharedStyle = findMSSharedStyleFromLayer;
      pasteInstanceSharedStyle(layer, MSSharedStyle);
      msg(context, `🤟 Switched to ${MSSharedStyle.name()}`);
    } else {
      msg(context, `😱 Text properties doesn't match any Style`);
    }
  });

  context.document.reloadInspector();
}

function search(context) {
  const sel = context.selection;
  context.document.currentPage().select_byExpandingSelection(0, 0);
  sel.forEach(layer => {
    if (layer.class() == "MSTextLayer") {
      if (checkIfStyleHasChanged(layer)) {
        layer.select_byExpandingSelection(true, true);
      }
    }
  });
}
