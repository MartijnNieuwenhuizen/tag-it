/* eslint-disable global-require */
/* eslint-disable no-new */

// Reference our components so they get included
const components = require('../../components');

// Reference generic ui and utils
Object.assign(components, require('ui/**/*.js', { mode: 'hash', resolve: ['strip-ext'] }));

const utils = require('utils/**/*.js', { mode: 'hash', resolve: ['reduce', 'strip-ext'] });
const { ready, queryAll } = utils.DOMHelpers.default;

const main = () => {

    const elements = queryAll('[data-module]:not([data-initialized])');

    elements.forEach(element => {

        // Convert dataset to object in a crossbrowser fashion
        const options = JSON.parse(JSON.stringify(element.dataset));

        options.module
            .split(',')
            .forEach(path => {
                const module = path in components ? components[path] : require(path);
                const Component = module.default ? module.default : module;
                new Component(element, options);
            });

        element.setAttribute('data-initialized', 'true');

    });

};

ready().then(main);
