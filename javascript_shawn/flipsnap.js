
(function($, $spe) {
    if(C.speColl === undefined) { C.speColl = {} };
    C.speColl.speCollFlipsnap = {
        flipsnap: Flipsnap('#speColl .flipsnap'),
        $flipsnap: $spe.find('.flipsnap'),
        isPaging: ($spe.find('._spe_paging').length) > 0,
        drawPaging: (function() {
            if(($spe.find('._spe_paging').length) > 0) {
                $spe.find('.flipsnap_item').each(function(key, item) {
                    $spe.find('._spe_paging').append('<span data-tab1="' + $(item).attr('data-tab1') + '"></span> ');
                });
            };
        })(),
        isMoreLink: ($spe.find('._spe_more').length) > 0,
        hideMoreLink: (function() {
            if(($spe.find('._spe_more').length) > 0) {
                $spe.find('._spe_more').hide()
            };
        })(),
        startIdx: (function() {
            var startIdx = 0;
            try {
                startIdx = sessionStorage.getItem('speColl%ED%94%8C%ED%85%8C4') || 0;
                $('#daumSearch').on({
                    submit: function(e) {
                        try {
                            sessionStorage.removeItem('speColl%ED%94%8C%ED%85%8C4');
                        } catch (err) {}
                    }
                });
                $(document).on('click', 'a.link_suggest,a.keyword.link_base', function(event) {
                    try {
                        sessionStorage.removeItem('speColl%ED%94%8C%ED%85%8C4');
                    } catch (err) {}
                });
            } catch (err) {}
            return startIdx;
        })(),
        init: function() {
            var _this = this;
            _this.setFlipsnap();
            _this.evtTab();
            _this.evtWindow();
            if(_this.startIdx > 0) {
                _this.flipsnap.moveToPoint(_this.startIdx)
            } else {
                $spe.find('.flipsnap_item').eq(0).addClass('_active')
            };
            _this.setMainTab();
            _this.setSubTab();
            _this.setPaging();
            _this.setMoreLink();
            _this.redrawPanel();
        }
    };
    C.speColl.speCollFlipsnap.setFlipsnap = function() {
        var _this = C.speColl.speCollFlipsnap;
        _this.flipsnap.element.addEventListener('fspointmove', function() {
            $spe.find('.flipsnap_item').removeClass('_active').eq(_this.flipsnap.currentPoint).addClass('_active');
            _this.redrawPanel();
            try {
                sessionStorage.setItem('speColl%ED%94%8C%ED%85%8C4', _this.flipsnap.currentPoint);
            } catch (err) {};
            _this.setMainTab();
            _this.setSubTab();
            _this.setPaging();
            _this.setMoreLink();
        }, false);
    };
    C.speColl.speCollFlipsnap.evtTab = function() {
        var _this = C.speColl.speCollFlipsnap,
            $elTabLink = $spe.find('._spe_tab li:not(._spe_tab_other) a'),
            $elSubTabLink = $spe.find('._spe_tab_sub li:not(._spe_tab_other) a');
        $spe.find('.flipsnap_item').each(function(key, item) {
            var tabIdx = parseInt($(item).attr('data-tab1'), 10),
                subTabIdx = parseInt($(item).attr('data-tab2'), 10),
                $curTabLink = $elTabLink.eq(tabIdx);
            if($curTabLink.attr('data-panel') === undefined) {
                $curTabLink.attr('data-panel', key);
            };
            if(!isNaN(subTabIdx)) {
                var $curSubTabLink = $spe.find('._spe_tab_sub[data-tab1="' + tabIdx + '"] li:not(._spe_tab_other) a').eq(subTabIdx);
                if($curSubTabLink.attr('data-panel') === undefined) {
                    $curSubTabLink.attr('data-panel', key);
                }
            }
        });
        $elTabLink.on('click', function(e) {
            e.preventDefault();
            var idx = parseInt($(this).attr('data-panel'), 10) || 0;
            _this.flipsnap.moveToPoint(idx);
        });
        $elSubTabLink.on('click', function(e) {
            e.preventDefault();
            var idx = parseInt($(this).attr('data-panel'), 10) || 0;
            _this.flipsnap.moveToPoint(idx);
        });
    };
    C.speColl.speCollFlipsnap.setMainTab = function() {
        var idx = parseInt($spe.find('._active').attr('data-tab1'), 10),
            $curTabWrap = $spe.find('._spe_tab'),
            $curTab = $curTabWrap.find('li:not(._spe_tab_other)').eq(idx);
        $curTab.addClass('on').siblings().removeClass('on');
        if($curTabWrap.parent().hasClass('tab_flex')) {
            var halfW = ($curTab.innerWidth()) / 2,
                parentHalfW = ($curTabWrap.innerWidth()) / 2,
                posX = $curTab[0].offsetLeft,
                moveX = posX - parentHalfW + halfW;
            $curTabWrap.scrollLeft(moveX);
        };
    };
    C.speColl.speCollFlipsnap.setSubTab = function() {
        var idx = parseInt($spe.find('._active').attr('data-tab1'), 10),
            $curTabWrap = $spe.find('._spe_tab_sub[data-tab1="' + idx + '"]');
        $spe.find('._spe_tab_sub').hide();
        $curTabWrap.show();
        if($curTabWrap.length > 0){
            var subTabIdx = parseInt($spe.find('._active').data('tab2'), 10) || 0,
                $curTab = $curTabWrap.find('li').eq(subTabIdx);
            $curTab.addClass('on').siblings().removeClass('on');
            $spe.find('._spe_tab_sub').parent('.tab_flex').show();
            if($curTabWrap.parent().hasClass('tab_flex')) {
                var halfW = ($curTab.innerWidth()) / 2,
                    parentHalfW = ($curTabWrap.innerWidth()) / 2,
                    posX = $curTab[0].offsetLeft,
                    moveX = posX - parentHalfW + halfW;
                $curTabWrap.scrollLeft(moveX);
            };
        } else {
            $spe.find('._spe_tab_sub').parent('.tab_flex').hide();
        }
    };
    C.speColl.speCollFlipsnap.setPaging = function() {
        var _this = C.speColl.speCollFlipsnap;
        if(!_this.isPaging) { return false }
        var $elPaging = $spe.find('._spe_paging span'),
            idx = _this.flipsnap.currentPoint,
            curTabIdx = $spe.find('._active').attr('data-tab1');
        $elPaging.hide().removeClass('on').eq(idx).addClass('on');
        var $curPaging = $elPaging.filter('[data-tab1=' + curTabIdx + ']');
        if($curPaging.length > 1) {
            $curPaging.show();
            $elPaging.parents('.extend_comp').removeClass('hide_underdot');
        } else {
            $elPaging.parents('.extend_comp').addClass('hide_underdot')
        };
    };
    C.speColl.speCollFlipsnap.setMoreLink = function(idx) {
        var _this = C.speColl.speCollFlipsnap;
        if(!_this.isMoreLink) { return false }
        var strHref = $spe.find('._active').attr('data-morelink');
        if(strHref !== undefined) {
            $spe.find('._spe_more').attr('href', strHref).show();
        } else {
            $spe.find('._spe_more').hide()
        };
    };
    C.speColl.speCollFlipsnap.redrawPanel = function() {
        var _this = C.speColl.speCollFlipsnap,
            $curElem = $spe.find('._active .flipsnap_wrap'),
            _height = $curElem.outerHeight();
        _this.$flipsnap.height(_height);
        _this.flipsnap.refresh();
    };
    C.speColl.speCollFlipsnap.evtWindow = function() {
        var _this = C.speColl.speCollFlipsnap,
            $window = $(window);
        $window.on('load', function(){
            _this.redrawPanel();
        });
        $window.on('resize', function(){
            _this.redrawPanel();
        });
    };
    C.speColl.speCollFlipsnap.init();
})(jq, jq('#speColl'))
