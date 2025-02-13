/**************************************************************
 * UTILITY FUNCTIONS
 * - scroll to BEGIN CONFIG to provide the config values
 *************************************************************/
const fs = require("fs");
const dir = __dirname;

// adds a rarity to the configuration. This is expected to correspond with a directory containing the rarity for each defined layer
// @param _id - id of the rarity
// @param _from - number in the edition to start this rarity from
// @param _to - number in the edition to generate this rarity to
// @return a rarity object used to dynamically generate the NFTs
const addRarity = (_id, _from, _to) => {
  const _rarityWeight = {
    value: _id,
    from: _from,
    to: _to,
    layerPercent: {},
  };
  return _rarityWeight;
};

// get the name without last 4 characters -> slice .png from the name
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};

// reads the filenames of a given folder and returns it with its name and path
const getElements = (_path, _elementCount) => {
  return fs
    .readdirSync(_path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i) => {
      return {
        id: _elementCount,
        name: cleanName(i),
        path: `${_path}/${i}`,
      };
    });
};

// adds a layer to the configuration. The layer will hold information on all the defined parts and
// where they should be rendered in the image
// @param _id - id of the layer
// @param _position - on which x/y value to render this part
// @param _size - of the image
// @return a layer object used to dynamically generate the NFTs
const addLayer = (_id, _position, _size) => {
  if (!_id) {
    console.log("error adding layer, parameters id required");
    return null;
  }
  if (!_position) {
    _position = { x: 0, y: 0 };
  }
  if (!_size) {
    _size = { width: width, height: height };
  }
  // add two different dimension for elements:
  // - all elements with their path information
  // - only the ids mapped to their rarity
  let elements = [];
  let elementCount = 0;
  let elementIdsForRarity = {};
  rarityWeights.forEach((rarityWeight) => {
    let elementsForRarity = getElements(`${dir}/${_id}/${rarityWeight.value}`);

    elementIdsForRarity[rarityWeight.value] = [];
    elementsForRarity.forEach((_elementForRarity) => {
      _elementForRarity.id = `${editionDnaPrefix}${elementCount}`;
      elements.push(_elementForRarity);
      elementIdsForRarity[rarityWeight.value].push(_elementForRarity.id);
      elementCount++;
    });
    elements[rarityWeight.value] = elementsForRarity;
  });

  let elementsForLayer = {
    id: _id,
    position: _position,
    size: _size,
    elements,
    elementIdsForRarity,
  };
  return elementsForLayer;
};

// adds layer-specific percentages to use one vs another rarity
// @param _rarityId - the id of the rarity to specifiy
// @param _layerId - the id of the layer to specifiy
// @param _percentages - an object defining the rarities and the percentage with which a given rarity for this layer should be used
const addRarityPercentForLayer = (_rarityId, _layerId, _percentages) => {
  let _rarityFound = false;
  rarityWeights.forEach((_rarityWeight) => {
    if (_rarityWeight.value === _rarityId) {
      let _percentArray = [];
      for (let percentType in _percentages) {
        _percentArray.push({
          id: percentType,
          percent: _percentages[percentType],
        });
      }
      _rarityWeight.layerPercent[_layerId] = _percentArray;
      _rarityFound = true;
    }
  });
  if (!_rarityFound) {
    console.log(
      `rarity ${_rarityId} not found, failed to add percentage information`
    );
  }
};

/**************************************************************
 * BEGIN CONFIG
 *************************************************************/

// image width in pixels
const width = 1000;
// image height in pixels
const height = 1000;
// description for NFT in metadata file
const description = "Bloon is a NFT Collection";
// base url to use in metadata file
// the id of the nft will be added to this url, in the example e.g. https://blooncollection.com/nft/1 for NFT with id 1
const baseImageUri = "https://blooncollection.com/nft";
// id for edition to start from
const startEditionFrom = 1;
// amount of NFTs to generate in edition
const editionSize = 1000;
// prefix to add to edition dna ids (to distinguish dna counts from different generation processes for the same collection)
const editionDnaPrefix = 0;

// create required weights
// for each weight, call 'addRarity' with the id and from which to which element this rarity should be applied
let rarityWeights = [
  addRarity("super_rare", 1, 50),
  addRarity("rare", 51, 300),
  addRarity("original", 301, 1000),
];

// create required layers
// for each layer, call 'addLayer' with the id and optionally the positioning and size
// the id would be the name of the folder in your input directory, e.g. 'ball' for ./input/ball
const layers = [
  addLayer("Background", { x: 0, y: 0 }, { width: width, height: height }),
  addLayer("Base"),
  addLayer("Outline"),
  addLayer("Shine"),
  addLayer("String"),
  addLayer("Eye"),
  addLayer("Pupil"),
  addLayer("Brows"),
  addLayer("Hat"),
  addLayer("Mouth"),
];

// provide any specific percentages that are required for a given layer and rarity level
// all provided options are used based on their percentage values to decide which layer to select from
addRarityPercentForLayer("super_rare", "Background", {
  super_rare: 15,
  rare: 40,
  original: 45,
});
addRarityPercentForLayer("rare", "Background", {
  super_rare: 10,
  rare: 30,
  original: 60,
});
addRarityPercentForLayer("original", "Background", {
  super_rare: 5,
  rare: 20,
  original: 75,
});

addRarityPercentForLayer("super_rare", "Base", {
  super_rare: 15,
  rare: 40,
  original: 45,
});
addRarityPercentForLayer("rare", "Base", {
  super_rare: 10,
  rare: 30,
  original: 60,
});
addRarityPercentForLayer("original", "Base", {
  super_rare: 5,
  rare: 20,
  original: 75,
});

addRarityPercentForLayer("super_rare", "Brows", {
  super_rare: 15,
  rare: 40,
  original: 45,
});
addRarityPercentForLayer("rare", "Brows", {
  super_rare: 10,
  rare: 30,
  original: 60,
});
addRarityPercentForLayer("original", "Brows", {
  super_rare: 5,
  rare: 20,
  original: 75,
});

addRarityPercentForLayer("super_rare", "Eye", {
  super_rare: 0,
  rare: 0,
  original: 100,
});
addRarityPercentForLayer("rare", "Eye", {
  super_rare: 0,
  rare: 0,
  original: 100,
});
addRarityPercentForLayer("original", "Eye", {
  super_rare: 0,
  rare: 0,
  original: 100,
});

addRarityPercentForLayer("super_rare", "Hat", {
  super_rare: 15,
  rare: 40,
  original: 45,
});
addRarityPercentForLayer("rare", "Hat", {
  super_rare: 10,
  rare: 30,
  original: 60,
});
addRarityPercentForLayer("original", "Hat", {
  super_rare: 5,
  rare: 20,
  original: 75,
});

addRarityPercentForLayer("super_rare", "Mouth", {
  super_rare: 15,
  rare: 40,
  original: 45,
});
addRarityPercentForLayer("rare", "Mouth", {
  super_rare: 10,
  rare: 30,
  original: 60,
});
addRarityPercentForLayer("original", "Mouth", {
  super_rare: 5,
  rare: 20,
  original: 75,
});

addRarityPercentForLayer("super_rare", "Outline", {
  super_rare: 0,
  rare: 0,
  original: 100,
});
addRarityPercentForLayer("rare", "Outline", {
  super_rare: 0,
  rare: 0,
  original: 100,
});
addRarityPercentForLayer("original", "Outline", {
  super_rare: 0,
  rare: 0,
  original: 100,
});

addRarityPercentForLayer("super_rare", "Pupil", {
  super_rare: 15,
  rare: 40,
  original: 45,
});
addRarityPercentForLayer("rare", "Pupil", {
  super_rare: 10,
  rare: 30,
  original: 60,
});
addRarityPercentForLayer("original", "Pupil", {
  super_rare: 5,
  rare: 20,
  original: 75,
});

addRarityPercentForLayer("super_rare", "Shine", {
  super_rare: 0,
  rare: 0,
  original: 100,
});
addRarityPercentForLayer("rare", "Shine", {
  super_rare: 0,
  rare: 0,
  original: 100,
});
addRarityPercentForLayer("original", "Shine", {
  super_rare: 0,
  rare: 0,
  original: 100,
});

addRarityPercentForLayer("super_rare", "String", {
  super_rare: 0,
  rare: 0,
  original: 100,
});
addRarityPercentForLayer("rare", "String", {
  super_rare: 0,
  rare: 0,
  original: 100,
});
addRarityPercentForLayer("original", "String", {
  super_rare: 0,
  rare: 0,
  original: 100,
});

module.exports = {
  layers,
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  rarityWeights,
};
