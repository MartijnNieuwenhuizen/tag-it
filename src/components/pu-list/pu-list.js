/**
 * @module PUlist
 * @todo Polyfills: window.fetch, Array.from
 * @todo jsDoc
 */
class PUlist {

    /**
     * @param {HTMLElement} element - The HTMLElement this module is constructed upon
     * @param {Object} options - ConditionerJS's merged options
     */
    constructor(element, options) {
        this._element = element;
        this._options = options;
        this.load();
    }

    /**
     * Base options
     */
    static options = {};

    /**
     */
    load() {

        this.cacheSelectors();

        this.puElements
            .map(pu => this.getPU(pu))
            .forEach(pu => this.getStatusLongPoll(pu, pu.cb));

    }

    /**
     */
    cacheSelectors() {
        this.puElements = Array.from(this._element.querySelectorAll('li'));
    }

    /**
     */
    getPU(pu) {
        return {
            el: pu,
            id: pu.getAttribute('data-pu-id'),
            cb: (data, pu) => this.render(data, pu)
        };
    }

    /**
     */
    getStatusLongPoll(pu, cb) {

        const url = this._options['getPuStatusUrl']
            .replace('{id}', encodeURIComponent(pu.id));

        const errorRedirect = () => {
            //window.location = this._options['dataGetPuFailureUrl'];
            console.log(this._options['dataGetPuFailureUrl']);
        };

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.success) {
                    return errorRedirect();
                }
                cb(data, pu)
            })
            .catch(errorRedirect);
    }

    /**
     */
    render(data, pu) {
        const el = pu.el.querySelector('[data-status]');
        el.removeAttribute('data-loading');
        if (error || data.failure || !data.success) {
            el.setAttribute('data-failure', '');
        } else {
            el.setAttribute('data-success', '');
        }
    }

}

// Exports
export default PUlist;
