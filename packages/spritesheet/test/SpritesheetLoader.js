const path = require('path');
const { Loader, LoaderResource } = require('@pixi/loaders');
const { Texture, BaseTexture } = require('@pixi/core');
const { SpritesheetLoader, Spritesheet } = require('../');

describe('PIXI.SpritesheetLoader', function ()
{
    it('should exist and return a function', function ()
    {
        expect(SpritesheetLoader).to.not.be.undefined;
        expect(SpritesheetLoader.use).to.be.a('function');
    });

    it('should install middleware', function (done)
    {
        Loader.registerPlugin(SpritesheetLoader);

        const loader = new Loader();

        loader.add('building1', path.join(__dirname, 'resources/building1.json'));
        loader.load((loader, resources) =>
        {
            expect(resources.building1).to.be.instanceof(LoaderResource);
            expect(resources.building1.spritesheet).to.be.instanceof(Spritesheet);
            loader.reset();
            done();
        });
    });

    it('should do nothing if the resource is not JSON', function ()
    {
        const spy = sinon.spy();
        const res = {};

        SpritesheetLoader.use(res, spy);

        expect(spy).to.have.been.calledOnce;
        expect(res.textures).to.be.undefined;
    });

    it('should do nothing if the resource is JSON, but improper format', function ()
    {
        const spy = sinon.spy();
        const res = createMockResource(LoaderResource.TYPE.JSON, {});

        SpritesheetLoader.use(res, spy);

        expect(spy).to.have.been.calledOnce;
        expect(res.textures).to.be.undefined;
    });

    it('should load the image & create textures if json is properly formatted', function ()
    {
        const spy = sinon.spy();
        const res = createMockResource(LoaderResource.TYPE.JSON, getJsonSpritesheet());
        const loader = new Loader();
        const addStub = sinon.stub(loader, 'add');
        const imgRes = createMockResource(LoaderResource.TYPE.IMAGE, new Image());

        imgRes.texture = new Texture(new BaseTexture(imgRes.data));

        addStub.yields(imgRes);

        SpritesheetLoader.use.call(loader, res, spy);

        addStub.restore();

        expect(spy).to.have.been.calledOnce;
        expect(addStub).to.have.been.calledWith(
            `${res.name}_image`,
            `${path.dirname(res.url)}/${res.data.meta.image}`
        );
        expect(res).to.have.property('textures')
            .that.is.an('object')
            .with.keys(Object.keys(getJsonSpritesheet().frames))
            .and.has.property('0.png')
            .that.is.an.instanceof(Texture);
    });

    it('should not load binary images as an image loader type', function (done)
    {
        const loader = new Loader();

        // provide a mock pre-loader that creates an empty base texture for compressed texture assets
        // this is necessary because the spritesheetParser expects a baseTexture on the resource
        loader.pre((resource, next) =>
        {
            if (resource.extension === 'crn')
            {
                resource.texture = Texture.EMPTY;
            }
            next();
        })
        .add(`atlas_crn`, `file://${__dirname}/resources/atlas_crn.json`)
        .add(`atlas`, `file://${__dirname}/resources/building1.json`)
        .load((loader, resources) =>
        {
            expect(resources.atlas_image.data).to.be.instanceof(HTMLImageElement);
            expect(resources.atlas_crn_image.data).to.not.be.instanceof(HTMLImageElement);
            loader.reset();
            done();
        });
    });

    it('should build the image url', function ()
    {
        function getPath(url, image)
        {
            return SpritesheetLoader.getResourcePath({
                url,
                data: { meta: { image } },
            });
        }

        let result = getPath('http://some.com/spritesheet.json', 'img.png');

        expect(result).to.be.equals('http://some.com/img.png');

        result = getPath('http://some.com/some/dir/spritesheet.json', 'img.png');
        expect(result).to.be.equals('http://some.com/some/dir/img.png');

        result = getPath('http://some.com/some/dir/spritesheet.json', './img.png');
        expect(result).to.be.equals('http://some.com/some/dir/img.png');

        result = getPath('http://some.com/some/dir/spritesheet.json', '../img.png');
        expect(result).to.be.equals('http://some.com/some/img.png');

        result = getPath('/spritesheet.json', 'img.png');
        expect(result).to.be.equals('/img.png');

        result = getPath('/some/dir/spritesheet.json', 'img.png');
        expect(result).to.be.equals('/some/dir/img.png');

        result = getPath('/some/dir/spritesheet.json', './img.png');
        expect(result).to.be.equals('/some/dir/img.png');

        result = getPath('/some/dir/spritesheet.json', '../img.png');
        expect(result).to.be.equals('/some/img.png');
    });

    // TODO: Test that rectangles are created correctly.
    // TODO: Test that bathc processing works correctly.
    // TODO: Test that resolution processing works correctly.
    // TODO: Test that metadata is honored.
});

function createMockResource(type, data)
{
    const name = `${Math.floor(Date.now() * Math.random())}`;

    return {
        url: `http://localhost/doesnt_exist/${name}`,
        name,
        type,
        data,
        metadata: {},
    };
}

function getJsonSpritesheet()
{
    /* eslint-disable */
    return {"frames": {
    "0.png":
    {
        "frame": {"x":14,"y":28,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    },
    "1.png":
    {
        "frame": {"x":14,"y":42,"w":12,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":12,"h":14},
        "sourceSize": {"w":12,"h":14}
    },
    "2.png":
    {
        "frame": {"x":14,"y":14,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    },
    "3.png":
    {
        "frame": {"x":42,"y":0,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    },
    "4.png":
    {
        "frame": {"x":28,"y":0,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    },
    "5.png":
    {
        "frame": {"x":14,"y":0,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    },
    "6.png":
    {
        "frame": {"x":0,"y":42,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    },
    "7.png":
    {
        "frame": {"x":0,"y":28,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    },
    "8.png":
    {
        "frame": {"x":0,"y":14,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    },
    "9.png":
    {
        "frame": {"x":0,"y":0,"w":14,"h":14},
        "rotated": false,
        "trimmed": false,
        "spriteSourceSize": {"x":0,"y":0,"w":14,"h":14},
        "sourceSize": {"w":14,"h":14}
    }},
    "meta": {
        "app": "http://www.texturepacker.com",
        "version": "1.0",
        "image": "hud.png",
        "format": "RGBA8888",
        "size": {"w":64,"h":64},
        "scale": "1",
        "smartupdate": "$TexturePacker:SmartUpdate:47025c98c8b10634b75172d4ed7e7edc$"
    }
    };
    /* eslint-enable */
}
