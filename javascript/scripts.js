function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

function rgbToHex(color) {
    color = "" + color;
    if (!color || color.indexOf("rgb") < 0) {
        return;
    }
    this;
    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);

    return (
        "#" +
        ((r.length == 1 ? "0" + r : r) +
            (g.length == 1 ? "0" + g : g) +
            (b.length == 1 ? "0" + b : b))
    );
}

class Block {
    constructor($container, count, dragging) {
        this.counter = count;
        this.container = $container;
        this.makeBlock();
        this.dragging = dragging;
    }

    behaviors() {
        this.setMove();
        this.dragAndDrop();
        this.setRandomColorOnClick();
    }

    setRandomColorOnClick(box) {
        if (box) {
            $(box).on("click", (event) => {
                if (!this.dragging) {
                    $(`.${event.target.classList[1]}`).css(
                        "background-color",
                        getRandomColor()
                    );
                    $(event.target.parentNode).data("color", [
                        ...$(event.target.parentNode).data("color"),
                        rgbToHex($(event.target).css("background-color")),
                    ]);
                    $(".color-block").remove();
                }
            });
        }
    }

    dragAndDrop(box) {
        if (box) {
            const that = this;
            let __dx;
            let __dy;
            let __recoupLeft, __recoupTop;

            box.draggable({
                stack: "div",
                drag: function (event, ui) {
                    __dx = ui.position.left - ui.originalPosition.left;
                    __dy = ui.position.top - ui.originalPosition.top;
                    ui.position.left = ui.originalPosition.left + __dx;
                    ui.position.top = ui.originalPosition.top + __dy;
                    ui.position.left += __recoupLeft;
                    ui.position.top += __recoupTop;
                },
                start: function (event, ui) {
                    that.dragging = true;
                    // $(".blocks").css({
                    //     transform: "rotateY(360deg) rotateX(0deg)",
                    // });
                    $(this).css("cursor", "pointer");
                    // $(".blocks__box").addClass("box_transform");
                    //resize bug fix ui drag
                    var left = parseInt($(this).css("left"), 10);
                    left = isNaN(left) ? 0 : left;
                    var top = parseInt($(this).css("top"), 10);
                    top = isNaN(top) ? 0 : top;
                    __recoupLeft = left - ui.position.left;
                    __recoupTop = top - ui.position.top;
                },
                stop: function (event, ui) {
                    $(this).css("cursor", "default");
                    setTimeout(() => {
                        that.dragging = false;
                        $(".blocks").css({
                            transformStyle: "preserve-3d",
                            transform: "rotateY(380deg) rotateX(50deg)",
                        });
                        $(".blocks__box").removeClass("box_transform");
                    }, 250);
                },
                create: function (event, ui) {
                    $(this).attr("oriLeft", $(this).css("left"));
                    $(this).attr("oriTop", $(this).css("top"));
                },
            });
            box.droppable({
                drop(event) {
                    if ($(event.toElement).width() < $(event.target).width()) {
                        const firstColor = $(event.toElement).css(
                            "background-color"
                        );
                        const secondColor = $(event.target).css(
                            "background-color"
                        );
                        const finishedColor = $.xcolor.average(
                            secondColor,
                            firstColor
                        );

                        $(event.toElement).remove();
                        $(event.target).css(
                            "background-color",
                            finishedColor.getRGB()
                        );
                        const changedColor = $(event.target).css(
                            "background-color"
                        );

                        $(event.target).data("color", [
                            ...$(event.target).data("color"),
                            rgbToHex(changedColor),
                        ]);
                        $("#color-block").remove();
                    }
                },
            });
        }
    }

    makeBlock() {
        const color = getRandomColor();
        const size = `${_.random(2, 4)}rem`;
        const halfSize = `${parseInt(size) / 2}rem`;
        const node = $(`
            <div class="blocks__box">
                <div class="blocks__box__item box-${this.counter}" id="box-top" style="transform: rotate3d(1, 0, 0, 90deg) translate3d(0px, 0px, ${halfSize}); height: ${size}; width: ${size}; background-color: ${color}"></div>
                <div class="blocks__box__item box-${this.counter}" id="box-bottom" style="transform: rotate3d(1, 0, 0, 90deg) translate3d(0px, 0px, -${halfSize}); height: ${size}; width: ${size}; background-color: ${color}"></div>
                <div class="blocks__box__item box-${this.counter}" id="box-front" style="transform: translate3d(0px, 0px, ${halfSize}); transform-origin: 0px 0px; height: ${size}; width: ${size}; background-color: ${color}"></div>
                <div class="blocks__box__item box-${this.counter}" id="box-back" style="transform: translate3d(0px, 0px, -${halfSize}); height: ${size}; width: ${size}; background-color: ${color}"></div>
                <div class="blocks__box__item box-${this.counter}" id="box-left" style="transform: rotate3d(0, 1, 0, 90deg) translate3d(0px, 0px, ${halfSize}); height: ${size}; width: ${size}; background-color: ${color}"></div>
                <div class="blocks__box__item box-${this.counter}" id="box-right" style="transform: rotate3d(0, 1, 0, 90deg) translate3d(0px, 0px, -${halfSize}); height: ${size}; width: ${size}; background-color: ${color}"></div>
            </div>`)
            .css("top", `${_.random(50, window.innerHeight - 150)}px`)
            .css("left", `${_.random(50, window.innerWidth - 150)}px`)
            .css("height", size)
            .css("width", size)
            .css("zIndex", _.random(0, 500))
            .css("position", "fixed")
            .css("transform", `translate3d(0px, 0px, ${_.random(10, 200)}px)`)
            .css("transform-style", "preserve-3d")
            .data("color", [color]);

        this.setMove(node);
        this.setRandomColorOnClick(node);
        this.dragAndDrop(node);

        this.container.append(node);
    }

    setMove(box = null) {
        if (box) {
            box.on("mouseenter", (event) => {
                let left = `${event.originalEvent.layerX}px`;
                let top = `${event.originalEvent.layerY}px`;
                const colors = $(event.target.parentNode).data("color");
                const blockList = $(
                    "<div id='color-block' class='color-block'></div>"
                );
                blockList.css({ top, left, zIndex: 10000 });
                blockList.css("transform", `translate3d(10px,10px,200px)`);

                this.container.append(blockList);
                colors.map((color) => {
                    const node = $(
                        `<div class='color_item' id=${color}>${color}</div>`
                    );
                    node.css("background-color", color);

                    blockList.append(node);
                });

                box.on("mousemove", (event) => {
                    let left = `${event.pageX + 20}px`;
                    let top = `${event.pageY + 20}px`;

                    blockList.css({ top, left, zIndex: 10000 });
                });

                box.on("mouseleave", () => {
                    blockList.remove();
                });
            });
        }
    }
}

class Container {
    constructor() {
        this.$container = $(".blocks");
        this.boxCount = _.random(20, 40);
        this.boxes = [];
        this.count;
        this.dragging = false;
    }

    init() {
        this.bodyModificator();
        this.createBoxes();
    }

    bodyModificator() {
        $("body").css("background-color", getRandomColor());
        $("body").on("click", () => {
            let isExist = $(".blocks__box")
                .attr("class")
                .includes("box_transform");
            const boxItem = $(".blocks__box");

            if (!isExist && !this.dragging) {
                boxItem.addClass("box_transform");
            } else {
                boxItem.removeClass("box_transform");
            }
        });
        $("body").append(this.$container);
    }

    createBoxes() {
        for (let i = 0; i < this.boxCount; i++) {
            this.count = i;
            this.boxes.push(
                new Block(this.$container, this.count, this.dragging)
            );
        }
    }
}

$(function () {
    const container = new Container();

    container.init();

    $(document).on("keydown", (event) => {
        const isCtrl = event.ctrlKey;
        if (
            (isCtrl && event.originalEvent.key == "r") ||
            (isCtrl && event.originalEvent.key == "к")
        ) {
            event.preventDefault();
            event.stopPropagation();
            $(".blocks").empty();
            // $("body").append("<div class='blocks' id='blocks'></div>");

            container.init();
        }
        $("#blocks").click(function () {
            $("#blocks").keypress();
        });
    });
});
