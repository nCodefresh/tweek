/* global describe, before, after, it, browser */

import KeysPage from '../../utils/KeysPage';
import selectors from '../../selectors/keySelectors';
import Chance from 'chance';

describe('add tags', () => {
    const NUMBER_OF_TAGS_TO_ADD = 1;

    const tagsTestKeyName = 'tags_test';
    const testFolder = KeysPage.TEST_KEYS_FOLDER;
    const tagsTestFolder = '@tags';
    const tagsTestKeyFullPath = `${testFolder}/${tagsTestFolder}/${tagsTestKeyName}`;

    const chance = new Chance();

    const enterKeyCode = '\uE007';

    before(() => {
        try {
            KeysPage.goToKey(tagsTestKeyFullPath);
        }
        catch (exp) {
            KeysPage.addEmptyKey(tagsTestKeyFullPath);
        }

        browser.windowHandleMaximize();
    });

    function addTag(tagName) {
        browser.setValue(selectors.TAGS_INPUT, tagName);
        browser.keys(enterKeyCode);
    }

    function getOpenedKeyTags() {
        const tagsElements = browser.elements(selectors.TAG);

        return tagsElements.value
            .map(x => browser.elementIdText(x.ELEMENT))
            .map(x => x.value)
            .filter(x => !!x && x !== '×')
            .map(x => x.slice(0, x.length - 2));
    }

    function isTagExists(tag) {
        const partialTag = tag.slice(0, tag.length - 1);
        browser.setValue(selectors.TAGS_INPUT, partialTag);
        browser.waitForVisible(selectors.TAGS_SUGGESTION, 1000);

        const tagsSuggestions = browser.elements(selectors.TAGS_SUGGESTION);
        return tagsSuggestions.value.length === 1;
    }

    it('should save the tag as a suggestion on submiting it without saving the key', () => {
        // Arrange
        KeysPage.goToKey(tagsTestKeyFullPath);

        const tagsToAdd = [];
        for (let tagsIndex = 0; tagsIndex < NUMBER_OF_TAGS_TO_ADD; tagsIndex++) tagsToAdd.push(chance.guid());

        // Act
        tagsToAdd.forEach(x => addTag(x));

        browser.refresh();
        browser.alertAccept();

        browser.waitForVisible(selectors.TAGS_INPUT, KeysPage.GIT_TRANSACTION_TIMEOUT);

        // Assert
        tagsToAdd.forEach(x => browser.waitUntil(() => isTagExists(x), KeysPage.GIT_TRANSACTION_TIMEOUT));
    });
});
