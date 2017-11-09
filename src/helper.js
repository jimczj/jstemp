/**
 * @file helper
 * @author jimczj
 * @created 2017-11-09
 */

function isSpaceOrNewlineOrTab(ch) {
    return ch === ' ' || ch === '\n' || ch === '\t';
}

module.exports = {
    isSpaceOrNewlineOrTab
};
