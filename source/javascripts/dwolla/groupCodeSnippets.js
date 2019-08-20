// This wraps all side by side code snippet languages in a
// div with the class dwolla.slateWL.groupCodeSnippets.GROUP_CLASS.
// Because there is no way to do it in slate without special markup.
// Also to insure the page doesn't shift we have to level all code
// snippets in a group to the same height.

// !! This breaks as soon as the large and unstable assumption that a
// snippet group will always contain all GROUPABLE_LANGS no longer
// can be assumed. This is also how selector.js works. !!

(function (dwolla) {
    'use strict';

    var GROUP_CLASS = 'code-snippet-group',
        GROUPABLE_LANGS = ['ruby',
                             'python',
                             'javascript',
                             'kotlin',
                             'php',
                             'raw'];

    function wrapTheGroup(group) {
        var groupJoin = $($.map(group, function (ele) {
                return $(ele).get();
            }));
        $(groupJoin).wrapAll('<div class="' + GROUP_CLASS + '">');
    }

    dwolla.namespace('slateWL.groupCodeSnippets', {
        init: function () {
            dwolla.slateWL.groupCodeSnippets.groupAndLevelAllCodeSnippets();
        },

        groupAndLevelAllCodeSnippets: function () {
            var wrapCollection = [],
                langCollection = [];

            $('.cnt-two-col__content .js-code-snippet').each(function (i, ele) {
                var lang = dwolla.slateWL.groupCodeSnippets.getLanguage($(ele).attr('class'));

                if (dwolla.slateWL.groupCodeSnippets.hasGroupableLang(lang)) {

                    if ($.inArray(lang, langCollection) < 0) {
                        // not a duplicate procced with collection
                        wrapCollection.push(ele);
                        langCollection.push(lang);
                    } else {
                        // is a duplicate start a new collection
                        wrapTheGroup(wrapCollection);
                        dwolla.slateWL.groupCodeSnippets.levelTheGroup(wrapCollection);
                        wrapCollection = [];
                        langCollection = [];
                        wrapCollection.push(ele);
                        langCollection.push(lang);
                    }
                }
            });

            //group the last one as well.
            wrapTheGroup(wrapCollection);
            dwolla.slateWL.groupCodeSnippets.levelTheGroup(wrapCollection);
        },

        getLanguage: function (classStr) {
            var regex = /language-([A-z]+)/,
                match = regex.exec(classStr);
            if (match) {
                return match[1];
            }
        },

        hasGroupableLang: function (lang) {
            if ($.inArray(lang, GROUPABLE_LANGS) >= 0) {
                return true;
            }

            return false;
        },

        levelTheGroup: function (group) {
            var i = group.length - 1,
                j = i,
                groupHeight = 0,
                height = 0;

            while (i >= 0) {
                height = $('.code-snippet__cnt', group[i]).outerHeight();
                if (height > groupHeight) {
                    groupHeight = height;
                }
                i -= 1;
            }

            while (j >= 0) {
                $('.code-snippet__cnt', group[j]).height(groupHeight);
                j -= 1;
            }
        }
    });

    $(dwolla.slateWL.groupCodeSnippets.init);
}(dwolla));
