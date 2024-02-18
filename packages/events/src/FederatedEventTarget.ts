import { utils } from '@pixi/core';
import { DisplayObject } from '@pixi/display';
import { EventSystem } from './EventSystem';
import { FederatedEvent } from './FederatedEvent';

import type { AllFederatedEventMap } from './FederatedEventMap';
import type { FederatedPointerEvent } from './FederatedPointerEvent';
import type { FederatedWheelEvent } from './FederatedWheelEvent';

export type Cursor = 'auto'
| 'default'
| 'none'
| 'context-menu'
| 'help'
| 'pointer'
| 'progress'
| 'wait'
| 'cell'
| 'crosshair'
| 'text'
| 'vertical-text'
| 'alias'
| 'copy'
| 'move'
| 'no-drop'
| 'not-allowed'
| 'e-resize'
| 'n-resize'
| 'ne-resize'
| 'nw-resize'
| 's-resize'
| 'se-resize'
| 'sw-resize'
| 'w-resize'
| 'ns-resize'
| 'ew-resize'
| 'nesw-resize'
| 'col-resize'
| 'nwse-resize'
| 'row-resize'
| 'all-scroll'
| 'zoom-in'
| 'zoom-out'
| 'grab'
| 'grabbing';

// @ignore - This is documented elsewhere.
export interface IHitArea
{
    contains(x: number, y: number): boolean;
}

/**
 * Function type for handlers, e.g., onclick
 * @memberof PIXI
 */
export type FederatedEventHandler<T= FederatedPointerEvent> = (event: T) => void;

/**
 * The type of interaction a DisplayObject can be. For more information on values and their meaning,
 * see {@link PIXI.DisplayObject.eventMode DisplayObject's eventMode property}.
 * @memberof PIXI
 * @since 7.2.0
 */
export type EventMode = 'none' | 'passive' | 'auto' | 'static' | 'dynamic';

/**
 * Describes the shape for a {@link PIXI.FederatedEvent}'s' `eventTarget`.
 * @memberof PIXI
 */
export interface FederatedEventTarget extends utils.EventEmitter, EventTarget
{
    /** The cursor preferred when the mouse pointer is hovering over. */
    cursor: Cursor | string;

    /** The parent of this event target. */
    readonly parent?: FederatedEventTarget;

    /** The children of this event target. */
    readonly children?: ReadonlyArray<FederatedEventTarget>;

    /** Whether this event target should fire UI events. */
    interactive: boolean
    _internalInteractive: boolean;
    /** The mode of interaction for this object */
    eventMode: EventMode;
    _internalEventMode: EventMode;

    /** Returns true if the DisplayObject has interactive 'static' or 'dynamic' */
    isInteractive: () => boolean;

    /** Whether this event target has any children that need UI events. This can be used optimize event propagation. */
    interactiveChildren: boolean;

    /** The hit-area specifies the area for which pointer events should be captured by this event target. */
    hitArea: IHitArea | null;

    // In Angular projects, zone.js is monkey patching the `EventTarget`
    // by adding its own `removeAllListeners(event?: string): void;` method,
    // so we have to override this signature when extending both `EventTarget` and `utils.EventEmitter`
    // to make it compatible with Angular projects
    // @see https://github.com/pixijs/pixijs/issues/8794

    /** Remove all listeners, or those of the specified event. */
    removeAllListeners(event?: string | symbol): this;

    /** Handler for 'click' event */
    onclick: FederatedEventHandler | null;
    /** Handler for 'mousedown' event */
    onmousedown: FederatedEventHandler | null;
    /** Handler for 'mouseenter' event */
    onmouseenter: FederatedEventHandler | null;
    /** Handler for 'mouseleave' event */
    onmouseleave: FederatedEventHandler | null;
    /** Handler for 'mousemove' event */
    onmousemove: FederatedEventHandler | null;
    /** Handler for 'globalmousemove' event */
    onglobalmousemove: FederatedEventHandler | null;
    /** Handler for 'mouseout' event */
    onmouseout: FederatedEventHandler | null;
    /** Handler for 'mouseover' event */
    onmouseover: FederatedEventHandler | null;
    /** Handler for 'mouseup' event */
    onmouseup: FederatedEventHandler | null;
    /** Handler for 'mouseupoutside' event */
    onmouseupoutside: FederatedEventHandler | null;
    /** Handler for 'pointercancel' event */
    onpointercancel: FederatedEventHandler | null;
    /** Handler for 'pointerdown' event */
    onpointerdown: FederatedEventHandler | null;
    /** Handler for 'pointerenter' event */
    onpointerenter: FederatedEventHandler | null;
    /** Handler for 'pointerleave' event */
    onpointerleave: FederatedEventHandler | null;
    /** Handler for 'pointermove' event */
    onpointermove: FederatedEventHandler | null;
    /** Handler for 'globalpointermove' event */
    onglobalpointermove: FederatedEventHandler | null;
    /** Handler for 'pointerout' event */
    onpointerout: FederatedEventHandler | null;
    /** Handler for 'pointerover' event */
    onpointerover: FederatedEventHandler | null;
    /** Handler for 'pointertap' event */
    onpointertap: FederatedEventHandler | null;
    /** Handler for 'pointerup' event */
    onpointerup: FederatedEventHandler | null;
    /** Handler for 'pointerupoutside' event */
    onpointerupoutside: FederatedEventHandler | null;
    /** Handler for 'rightclick' event */
    onrightclick: FederatedEventHandler | null;
    /** Handler for 'rightdown' event */
    onrightdown: FederatedEventHandler | null;
    /** Handler for 'rightup' event */
    onrightup: FederatedEventHandler | null;
    /** Handler for 'rightupoutside' event */
    onrightupoutside: FederatedEventHandler | null;
    /** Handler for 'tap' event */
    ontap: FederatedEventHandler | null;
    /** Handler for 'touchcancel' event */
    ontouchcancel: FederatedEventHandler | null;
    /** Handler for 'touchend' event */
    ontouchend: FederatedEventHandler | null;
    /** Handler for 'touchendoutside' event */
    ontouchendoutside: FederatedEventHandler | null;
    /** Handler for 'touchmove' event */
    ontouchmove: FederatedEventHandler | null;
    /** Handler for 'globaltouchmove' event */
    onglobaltouchmove: FederatedEventHandler | null;
    /** Handler for 'touchstart' event */
    ontouchstart: FederatedEventHandler | null;
    /** Handler for 'wheel' event */
    onwheel: FederatedEventHandler<FederatedWheelEvent> | null;
}

type AddListenerOptions = boolean | AddEventListenerOptions;
type RemoveListenerOptions = boolean | EventListenerOptions;

export interface IFederatedDisplayObject
    extends Omit<FederatedEventTarget, 'parent' | 'children' | keyof utils.EventEmitter | 'cursor'>
{
    addEventListener<K extends keyof AllFederatedEventMap>(
        type: K,
        listener: (e: AllFederatedEventMap[K]) => any,
        options?: AddListenerOptions
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: AddListenerOptions
    ): void;
    removeEventListener<K extends keyof AllFederatedEventMap>(
        type: K,
        listener: (e: AllFederatedEventMap[K]) => any,
        options?: RemoveListenerOptions
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: RemoveListenerOptions
    ): void;
}

function convertEventModeToInteractiveMode(mode: EventMode): boolean
{
    return mode === 'dynamic' || mode === 'static';
}

export const FederatedDisplayObject: IFederatedDisplayObject = {

    /**
     * Property-based event handler for the `click` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onclick = (event) => {
     *  //some function here that happens on click
     * }
     */
    onclick: null,

    /**
     * Property-based event handler for the `mousedown` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onmousedown = (event) => {
     *  //some function here that happens on mousedown
     * }
     */
    onmousedown: null,

    /**
     * Property-based event handler for the `mouseenter` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onmouseenter = (event) => {
     *  //some function here that happens on mouseenter
     * }
     */
    onmouseenter: null,

    /**
     * Property-based event handler for the `mouseleave` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onmouseleave = (event) => {
     *  //some function here that happens on mouseleave
     * }
     */
    onmouseleave: null,

    /**
     * Property-based event handler for the `mousemove` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onmousemove = (event) => {
     *  //some function here that happens on mousemove
     * }
     */
    onmousemove: null,

    /**
     * Property-based event handler for the `globalmousemove` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onglobalmousemove = (event) => {
     *  //some function here that happens on globalmousemove
     * }
     */
    onglobalmousemove: null,

    /**
     * Property-based event handler for the `mouseout` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onmouseout = (event) => {
     *  //some function here that happens on mouseout
     * }
     */
    onmouseout: null,

    /**
     * Property-based event handler for the `mouseover` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onmouseover = (event) => {
     *  //some function here that happens on mouseover
     * }
     */
    onmouseover:  null,

    /**
     * Property-based event handler for the `mouseup` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onmouseup = (event) => {
     *  //some function here that happens on mouseup
     * }
     */
    onmouseup:  null,

    /**
     * Property-based event handler for the `mouseupoutside` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onmouseupoutside = (event) => {
     *  //some function here that happens on mouseupoutside
     * }
     */
    onmouseupoutside:  null,

    /**
     * Property-based event handler for the `pointercancel` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointercancel = (event) => {
     *  //some function here that happens on pointercancel
     * }
     */
    onpointercancel:  null,

    /**
     * Property-based event handler for the `pointerdown` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointerdown = (event) => {
     *  //some function here that happens on pointerdown
     * }
     */
    onpointerdown:  null,

    /**
     * Property-based event handler for the `pointerenter` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointerenter = (event) => {
     *  //some function here that happens on pointerenter
     * }
     */
    onpointerenter:  null,

    /**
     * Property-based event handler for the `pointerleave` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointerleave = (event) => {
     *  //some function here that happens on pointerleave
     * }
     */
    onpointerleave:  null,

    /**
     * Property-based event handler for the `pointermove` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointermove = (event) => {
     *  //some function here that happens on pointermove
     * }
     */
    onpointermove:  null,

    /**
     * Property-based event handler for the `globalpointermove` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onglobalpointermove = (event) => {
     *  //some function here that happens on globalpointermove
     * }
     */
    onglobalpointermove:  null,

    /**
     * Property-based event handler for the `pointerout` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointerout = (event) => {
     *  //some function here that happens on pointerout
     * }
     */
    onpointerout:  null,

    /**
     * Property-based event handler for the `pointerover` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointerover = (event) => {
     *  //some function here that happens on pointerover
     * }
     */
    onpointerover:  null,

    /**
     * Property-based event handler for the `pointertap` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointertap = (event) => {
     *  //some function here that happens on pointertap
     * }
     */
    onpointertap:  null,

    /**
     * Property-based event handler for the `pointerup` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointerup = (event) => {
     *  //some function here that happens on pointerup
     * }
     */
    onpointerup:  null,

    /**
     * Property-based event handler for the `pointerupoutside` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onpointerupoutside = (event) => {
     *  //some function here that happens on pointerupoutside
     * }
     */
    onpointerupoutside:  null,

    /**
     * Property-based event handler for the `rightclick` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onrightclick = (event) => {
     *  //some function here that happens on rightclick
     * }
     */
    onrightclick:  null,

    /**
     * Property-based event handler for the `rightdown` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onrightdown = (event) => {
     *  //some function here that happens on rightdown
     * }
     */
    onrightdown:  null,

    /**
     * Property-based event handler for the `rightup` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onrightup = (event) => {
     *  //some function here that happens on rightup
     * }
     */
    onrightup:  null,

    /**
     * Property-based event handler for the `rightupoutside` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onrightupoutside = (event) => {
     *  //some function here that happens on rightupoutside
     * }
     */
    onrightupoutside:  null,

    /**
     * Property-based event handler for the `tap` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.ontap = (event) => {
     *  //some function here that happens on tap
     * }
     */
    ontap:  null,

    /**
     * Property-based event handler for the `touchcancel` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.ontouchcancel = (event) => {
     *  //some function here that happens on touchcancel
     * }
     */
    ontouchcancel:  null,

    /**
     * Property-based event handler for the `touchend` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.ontouchend = (event) => {
     *  //some function here that happens on touchend
     * }
     */
    ontouchend:  null,

    /**
     * Property-based event handler for the `touchendoutside` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.ontouchendoutside = (event) => {
     *  //some function here that happens on touchendoutside
     * }
     */
    ontouchendoutside:  null,

    /**
     * Property-based event handler for the `touchmove` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.ontouchmove = (event) => {
     *  //some function here that happens on touchmove
     * }
     */
    ontouchmove:  null,

    /**
     * Property-based event handler for the `globaltouchmove` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onglobaltouchmove = (event) => {
     *  //some function here that happens on globaltouchmove
     * }
     */
    onglobaltouchmove:  null,

    /**
     * Property-based event handler for the `touchstart` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.ontouchstart = (event) => {
     *  //some function here that happens on touchstart
     * }
     */
    ontouchstart:  null,

    /**
     * Property-based event handler for the `wheel` event.
     * @memberof PIXI.DisplayObject#
     * @default null
     * @example
     * this.onwheel = (event) => {
     *  //some function here that happens on wheel
     * }
     */
    onwheel:  null,
    /**
     * @ignore
     */
    _internalInteractive: undefined,
    /**
     * Enable interaction events for the DisplayObject. Touch, pointer and mouse
     * @memberof PIXI.DisplayObject#
     */
    get interactive()
    {
        return this._internalInteractive ?? convertEventModeToInteractiveMode(EventSystem.defaultEventMode);
    },
    set interactive(value: boolean)
    {
        if (process.env.DEBUG)
        {
            utils.deprecation(
                '7.2.0',
                // eslint-disable-next-line max-len
                `Setting interactive is deprecated, use eventMode = 'none'/'passive'/'auto'/'static'/'dynamic' instead.`
            );
        }

        this._internalInteractive = value;
        this.eventMode = value ? 'static' : 'auto';
    },
    /**
     * @ignore
     */
    _internalEventMode: undefined,
    /**
     * Enable interaction events for the DisplayObject. Touch, pointer and mouse.
     * This now replaces the `interactive` property.
     * There are 5 types of interaction settings:
     * - `'none'`: Ignores all interaction events, even on its children.
     * - `'passive'`: Does not emit events and ignores all hit testing on itself and non-interactive children.
     * Interactive children will still emit events.
     * - `'auto'`: Does not emit events but is hit tested if parent is interactive. Same as `interactive = false` in v7
     * - `'static'`: Emit events and is hit tested. Same as `interaction = true` in v7
     * - `'dynamic'`: Emits events and is hit tested but will also receive mock interaction events fired from a ticker to
     * allow for interaction when the mouse isn't moving
     * @example
     * import { Sprite } from 'pixi.js';
     *
     * const sprite = new Sprite(texture);
     * sprite.eventMode = 'static';
     * sprite.on('tap', (event) => {
     *     // Handle event
     * });
     * @memberof PIXI.DisplayObject#
     * @since 7.2.0
     */
    get eventMode()
    {
        return this._internalEventMode ?? EventSystem.defaultEventMode;
    },
    set eventMode(value)
    {
        this._internalInteractive = convertEventModeToInteractiveMode(value);
        this._internalEventMode = value;
    },

    /**
     * Determines if the displayObject is interactive or not
     * @returns {boolean} Whether the displayObject is interactive or not
     * @memberof PIXI.DisplayObject#
     * @since 7.2.0
     * @example
     * import { Sprite } from 'pixi.js';
     * const sprite = new Sprite(texture);
     * sprite.eventMode = 'static';
     * sprite.isInteractive(); // true
     *
     * sprite.eventMode = 'dynamic';
     * sprite.isInteractive(); // true
     *
     * sprite.eventMode = 'none';
     * sprite.isInteractive(); // false
     *
     * sprite.eventMode = 'passive';
     * sprite.isInteractive(); // false
     *
     * sprite.eventMode = 'auto';
     * sprite.isInteractive(); // false
     */
    isInteractive()
    {
        return this.eventMode === 'static' || this.eventMode === 'dynamic';
    },

    /**
     * Determines if the children to the displayObject can be clicked/touched
     * Setting this to false allows PixiJS to bypass a recursive `hitTest` function
     * @memberof PIXI.Container#
     */
    interactiveChildren: true,

    /**
     * Interaction shape. Children will be hit first, then this shape will be checked.
     * Setting this will cause this shape to be checked in hit tests rather than the displayObject's bounds.
     * @example
     * import { Rectangle, Sprite } from 'pixi.js';
     *
     * const sprite = new Sprite(texture);
     * sprite.interactive = true;
     * sprite.hitArea = new Rectangle(0, 0, 100, 100);
     * @member {PIXI.IHitArea}
     * @memberof PIXI.DisplayObject#
     */
    hitArea: null,

    /**
     * Unlike `on` or `addListener` which are methods from EventEmitter, `addEventListener`
     * seeks to be compatible with the DOM's `addEventListener` with support for options.
     * **IMPORTANT:** _Only_ available if using the `@pixi/events` package.
     * @memberof PIXI.DisplayObject
     * @param type - The type of event to listen to.
     * @param listener - The listener callback or object.
     * @param options - Listener options, used for capture phase.
     * @example
     * // Tell the user whether they did a single, double, triple, or nth click.
     * button.addEventListener('click', {
     *     handleEvent(e): {
     *         let prefix;
     *
     *         switch (e.detail) {
     *             case 1: prefix = 'single'; break;
     *             case 2: prefix = 'double'; break;
     *             case 3: prefix = 'triple'; break;
     *             default: prefix = e.detail + 'th'; break;
     *         }
     *
     *         console.log('That was a ' + prefix + 'click');
     *     }
     * });
     *
     * // But skip the first click!
     * button.parent.addEventListener('click', function blockClickOnce(e) {
     *     e.stopImmediatePropagation();
     *     button.parent.removeEventListener('click', blockClickOnce, true);
     * }, {
     *     capture: true,
     * });
     */
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: AddListenerOptions
    )
    {
        const capture = (typeof options === 'boolean' && options)
            || (typeof options === 'object' && options.capture);
        const signal = typeof options === 'object' ? options.signal : undefined;
        const once = typeof options === 'object' ? (options.once === true) : false;
        const context = typeof listener === 'function' ? undefined : listener;

        type = capture ? `${type}capture` : type;
        const listenerFn = typeof listener === 'function' ? listener : listener.handleEvent;

        const emitter = (this as unknown as utils.EventEmitter);

        if (signal)
        {
            signal.addEventListener('abort', () =>
            {
                emitter.off(type, listenerFn, context);
            });
        }

        if (once)
        {
            emitter.once(type, listenerFn, context);
        }
        else
        {
            emitter.on(type, listenerFn, context);
        }
    },

    /**
     * Unlike `off` or `removeListener` which are methods from EventEmitter, `removeEventListener`
     * seeks to be compatible with the DOM's `removeEventListener` with support for options.
     * **IMPORTANT:** _Only_ available if using the `@pixi/events` package.
     * @memberof PIXI.DisplayObject
     * @param type - The type of event the listener is bound to.
     * @param listener - The listener callback or object.
     * @param options - The original listener options. This is required to deregister a capture phase listener.
     */
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: RemoveListenerOptions
    )
    {
        const capture = (typeof options === 'boolean' && options)
            || (typeof options === 'object' && options.capture);
        const context = typeof listener === 'function' ? undefined : listener;

        type = capture ? `${type}capture` : type;
        listener = typeof listener === 'function' ? listener : listener.handleEvent;

        (this as unknown as utils.EventEmitter).off(type, listener, context);
    },

    /**
     * Dispatch the event on this {@link PIXI.DisplayObject} using the event's {@link PIXI.EventBoundary}.
     *
     * The target of the event is set to `this` and the `defaultPrevented` flag is cleared before dispatch.
     *
     * **IMPORTANT:** _Only_ available if using the `@pixi/events` package.
     * @memberof PIXI.DisplayObject
     * @param e - The event to dispatch.
     * @returns Whether the {@link PIXI.FederatedEvent.preventDefault preventDefault}() method was not invoked.
     * @example
     * // Reuse a click event!
     * button.dispatchEvent(clickEvent);
     */
    dispatchEvent(e: Event): boolean
    {
        if (!(e instanceof FederatedEvent))
        {
            throw new Error('DisplayObject cannot propagate events outside of the Federated Events API');
        }

        e.defaultPrevented = false;
        e.path = null;
        e.target = this as unknown as FederatedEventTarget;
        e.manager.dispatchEvent(e);

        return !e.defaultPrevented;
    }
};

DisplayObject.mixin(FederatedDisplayObject);
