define([
        '../Core/defaultValue',
        '../Core/defined',
        '../Core/defineProperties',
        '../Core/DeveloperError',
        '../Core/Event',
        './createPropertyDescriptor',
        './NodeTransformationProperty',
        './PropertyBag'
    ], function(
        defaultValue,
        defined,
        defineProperties,
        DeveloperError,
        Event,
        createPropertyDescriptor,
        NodeTransformationProperty,
        PropertyBag) {
    'use strict';

    function createNodeTransformationProperty(value) {
        return new NodeTransformationProperty(value);
    }

    function createNodeTransformationPropertyBag(value) {
        return new PropertyBag(value, createNodeTransformationProperty);
    }

    /**
     * A 3D model based on {@link https://github.com/KhronosGroup/glTF|glTF}, the runtime asset format for WebGL, OpenGL ES, and OpenGL.
     * The position and orientation of the model is determined by the containing {@link Entity}.
     * <p>
     * Cesium includes support for glTF geometry, materials, animations, and skinning.
     * Cameras and lights are not currently supported.
     * </p>
     *
     * @alias ModelGraphics
     * @constructor
     *
     * @param {Object} [options] Object with the following properties:
     * @param {Property} [options.uri] A string Property specifying the URI of the glTF asset.
     * @param {Property} [options.show=true] A boolean Property specifying the visibility of the model.
     * @param {Property} [options.scale=1.0] A numeric Property specifying a uniform linear scale.
     * @param {Property} [options.minimumPixelSize=0.0] A numeric Property specifying the approximate minimum pixel size of the model regardless of zoom.
     * @param {Property} [options.maximumScale] The maximum scale size of a model. An upper limit for minimumPixelSize.
     * @param {Property} [options.incrementallyLoadTextures=true] Determine if textures may continue to stream in after the model is loaded.
     * @param {Property} [options.runAnimations=true] A boolean Property specifying if glTF animations specified in the model should be started.
     * @param {Property} [options.clampAnimations=true] A boolean Property specifying if glTF animations should hold the last pose for time durations with no keyframes.
     * @param {Property} [options.nodeTransformations] An object, where keys are names of nodes, and values are {@link TranslationRotationScale} Properties describing the transformation to apply to that node.
     * @param {Property} [options.shadows=ShadowMode.ENABLED] An enum Property specifying whether the model casts or receives shadows from each light source.
     * @param {Property} [options.heightReference=HeightReference.NONE] A Property specifying what the height is relative to.
     * @param {Property} [options.distanceDisplayCondition] A Property specifying at what distance from the camera that this model will be displayed.
     * @param {Property} [options.silhouetteColor=Color.RED] A Property specifying the {@link Color} of the silhouette.
     * @param {Property} [options.silhouetteSize=0.0] A numeric Property specifying the size of the silhouette in pixels.
     * @param {Property} [options.color=Color.WHITE] A Property specifying the {@link Color} that blends with the model's rendered color.
     * @param {Property} [options.colorBlendMode=ColorBlendMode.HIGHLIGHT] An enum Property specifying how the color blends with the model.
     * @param {Property} [options.colorBlendAmount=0.5] A numeric Property specifying the color strength when the <code>colorBlendMode</code> is <code>MIX</code>. A value of 0.0 results in the model's rendered color while a value of 1.0 results in a solid color, with any value in-between resulting in a mix of the two.
     *
     * @see {@link http://cesiumjs.org/2014/03/03/Cesium-3D-Models-Tutorial/|3D Models Tutorial}
     * @demo {@link http://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=3D%20Models.html|Cesium Sandcastle 3D Models Demo}
     */
    function ModelGraphics(options) {
        this._show = undefined;
        this._showSubscription = undefined;
        this._scale = undefined;
        this._scaleSubscription = undefined;
        this._minimumPixelSize = undefined;
        this._minimumPixelSizeSubscription = undefined;
        this._maximumScale = undefined;
        this._maximumScaleSubscription = undefined;
        this._incrementallyLoadTextures = undefined;
        this._incrementallyLoadTexturesSubscription = undefined;
        this._shadows = undefined;
        this._shadowsSubscription = undefined;
        this._uri = undefined;
        this._uriSubscription = undefined;
        this._runAnimations = undefined;
        this._clampAnimations = undefined;
        this._runAnimationsSubscription = undefined;
        this._nodeTransformations = undefined;
        this._nodeTransformationsSubscription = undefined;
        this._heightReference = undefined;
        this._heightReferenceSubscription = undefined;
        this._distanceDisplayCondition = undefined;
        this._distanceDisplayConditionSubscription = undefined;
        this._silhouetteColor = undefined;
        this._silhouetteColorSubscription = undefined;
        this._silhouetteSize = undefined;
        this._silhouetteSizeSubscription = undefined;
        this._color = undefined;
        this._colorSubscription = undefined;
        this._colorBlendMode = undefined;
        this._colorBlendModeSubscription = undefined;
        this._colorBlendAmount = undefined;
        this._colorBlendAmountSubscription = undefined;
        this._definitionChanged = new Event();

        this.merge(defaultValue(options, defaultValue.EMPTY_OBJECT));
    }

    defineProperties(ModelGraphics.prototype, {
        /**
         * Gets the event that is raised whenever a property or sub-property is changed or modified.
         * @memberof ModelGraphics.prototype
         * @type {Event}
         * @readonly
         */
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        },

        /**
         * Gets or sets the boolean Property specifying the visibility of the model.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default true
         */
        show : createPropertyDescriptor('show'),

        /**
         * Gets or sets the numeric Property specifying a uniform linear scale
         * for this model. Values greater than 1.0 increase the size of the model while
         * values less than 1.0 decrease it.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default 1.0
         */
        scale : createPropertyDescriptor('scale'),

        /**
         * Gets or sets the numeric Property specifying the approximate minimum
         * pixel size of the model regardless of zoom. This can be used to ensure that
         * a model is visible even when the viewer zooms out.  When <code>0.0</code>,
         * no minimum size is enforced.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default 0.0
         */
        minimumPixelSize : createPropertyDescriptor('minimumPixelSize'),

        /**
         * Gets or sets the numeric Property specifying the maximum scale
         * size of a model. This property is used as an upper limit for
         * {@link ModelGraphics#minimumPixelSize}.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         */
        maximumScale : createPropertyDescriptor('maximumScale'),

        /**
         * Get or sets the boolean Property specifying whether textures
         * may continue to stream in after the model is loaded.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         */
        incrementallyLoadTextures : createPropertyDescriptor('incrementallyLoadTextures'),

        /**
         * Get or sets the enum Property specifying whether the model
         * casts or receives shadows from each light source.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default ShadowMode.ENABLED
         */
        shadows : createPropertyDescriptor('shadows'),

        /**
         * Gets or sets the string Property specifying the URI of the glTF asset.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         */
        uri : createPropertyDescriptor('uri'),

        /**
         * Gets or sets the boolean Property specifying if glTF animations should be run.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default true
         */
        runAnimations : createPropertyDescriptor('runAnimations'),

        /**
         * Gets or sets the boolean Property specifying if glTF animations should hold the last pose for time durations with no keyframes.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default true
         */
        clampAnimations : createPropertyDescriptor('clampAnimations'),

        /**
         * Gets or sets the set of node transformations to apply to this model.  This is represented as an {@link PropertyBag}, where keys are
         * names of nodes, and values are {@link TranslationRotationScale} Properties describing the transformation to apply to that node.
         * @memberof ModelGraphics.prototype
         * @type {PropertyBag}
         */
        nodeTransformations : createPropertyDescriptor('nodeTransformations', undefined, createNodeTransformationPropertyBag),

        /**
         * Gets or sets the Property specifying the {@link HeightReference}.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default HeightReference.NONE
         */
        heightReference : createPropertyDescriptor('heightReference'),

        /**
         * Gets or sets the {@link DistanceDisplayCondition} Property specifying at what distance from the camera that this model will be displayed.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         */
        distanceDisplayCondition : createPropertyDescriptor('distanceDisplayCondition'),

        /**
         * Gets or sets the Property specifying the {@link Color} of the silhouette.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default Color.RED
         */
        silhouetteColor: createPropertyDescriptor('silhouetteColor'),

        /**
         * Gets or sets the numeric Property specifying the size of the silhouette in pixels.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default 0.0
         */
        silhouetteSize : createPropertyDescriptor('silhouetteSize'),

        /**
         * Gets or sets the Property specifying the {@link Color} that blends with the model's rendered color.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default Color.WHITE
         */
        color : createPropertyDescriptor('color'),

        /**
         * Gets or sets the enum Property specifying how the color blends with the model.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default ColorBlendMode.HIGHLIGHT
         */
        colorBlendMode : createPropertyDescriptor('colorBlendMode'),

        /**
         * A numeric Property specifying the color strength when the <code>colorBlendMode</code> is MIX.
         * A value of 0.0 results in the model's rendered color while a value of 1.0 results in a solid color, with
         * any value in-between resulting in a mix of the two.
         * @memberof ModelGraphics.prototype
         * @type {Property}
         * @default 0.5
         */
        colorBlendAmount : createPropertyDescriptor('colorBlendAmount')
    });

    /**
     * Duplicates this instance.
     *
     * @param {ModelGraphics} [result] The object onto which to store the result.
     * @returns {ModelGraphics} The modified result parameter or a new instance if one was not provided.
     */
    ModelGraphics.prototype.clone = function(result) {
        if (!defined(result)) {
            return new ModelGraphics(this);
        }
        result.show = this.show;
        result.scale = this.scale;
        result.minimumPixelSize = this.minimumPixelSize;
        result.maximumScale = this.maximumScale;
        result.incrementallyLoadTextures = this.incrementallyLoadTextures;
        result.shadows = this.shadows;
        result.uri = this.uri;
        result.runAnimations = this.runAnimations;
        result.clampAnimations = this.clampAnimations;
        result.nodeTransformations = this.nodeTransformations;
        result.heightReference = this._heightReference;
        result.distanceDisplayCondition = this.distanceDisplayCondition;
        result.silhouetteColor = this.silhouetteColor;
        result.silhouetteSize = this.silhouetteSize;
        result.color = this.color;
        result.colorBlendMode = this.colorBlendMode;
        result.colorBlendAmount = this.colorBlendAmount;

        return result;
    };

    /**
     * Assigns each unassigned property on this object to the value
     * of the same property on the provided source object.
     *
     * @param {ModelGraphics} source The object to be merged into this object.
     */
    ModelGraphics.prototype.merge = function(source) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(source)) {
            throw new DeveloperError('source is required.');
        }
        //>>includeEnd('debug');

        this.show = defaultValue(this.show, source.show);
        this.scale = defaultValue(this.scale, source.scale);
        this.minimumPixelSize = defaultValue(this.minimumPixelSize, source.minimumPixelSize);
        this.maximumScale = defaultValue(this.maximumScale, source.maximumScale);
        this.incrementallyLoadTextures = defaultValue(this.incrementallyLoadTextures, source.incrementallyLoadTextures);
        this.shadows = defaultValue(this.shadows, source.shadows);
        this.uri = defaultValue(this.uri, source.uri);
        this.runAnimations = defaultValue(this.runAnimations, source.runAnimations);
        this.clampAnimations = defaultValue(this.clampAnimations, source.clampAnimations);
        this.heightReference = defaultValue(this.heightReference, source.heightReference);
        this.distanceDisplayCondition = defaultValue(this.distanceDisplayCondition, source.distanceDisplayCondition);
        this.silhouetteColor = defaultValue(this.silhouetteColor, source.silhouetteColor);
        this.silhouetteSize = defaultValue(this.silhouetteSize, source.silhouetteSize);
        this.color = defaultValue(this.color, source.color);
        this.colorBlendMode = defaultValue(this.colorBlendMode, source.colorBlendMode);
        this.colorBlendAmount = defaultValue(this.colorBlendAmount, source.colorBlendAmount);

        var sourceNodeTransformations = source.nodeTransformations;
        if (defined(sourceNodeTransformations)) {
            var targetNodeTransformations = this.nodeTransformations;
            if (defined(targetNodeTransformations)) {
                targetNodeTransformations.merge(sourceNodeTransformations);
            } else {
                this.nodeTransformations = new PropertyBag(sourceNodeTransformations, createNodeTransformationProperty);
            }
        }
    };

    return ModelGraphics;
});
