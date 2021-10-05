import { expect } from "chai";
import { Item, GildedRose } from "../app/gilded-rose";

describe("Gilded Rose", function () {
  describe("updateQuality", function () {
    describe("Normal items", function () {
      it("Should lower the sellIn value by one after a day", function () {
        const gildedRose = new GildedRose([
          new Item("+5 Dexterity Vest", 10, 20),
          new Item("Elixir of the Mongoose", 5, 7),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].sellIn).to.equal(9);
        expect(items[1].sellIn).to.equal(4);
      });

      it("SellIn can be negative", function () {
        const gildedRose = new GildedRose([
          new Item("+5 Dexterity Vest", 0, 20),
          new Item("Elixir of the Mongoose", -1, 7),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].sellIn).to.equal(-1);
        expect(items[1].sellIn).to.equal(-2);
      });

      it("Should degrade the quality by one after a day", function () {
        const gildedRose = new GildedRose([
          new Item("+5 Dexterity Vest", 10, 20),
          new Item("Elixir of the Mongoose", 5, 7),
          new Item("Elixir of the Mongoose", 1, 9),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(19);
        expect(items[1].quality).to.equal(6);
        expect(items[2].quality).to.equal(8);
      });

      it("The quality should degrade twice as fast when sell by date has passed", function () {
        const gildedRose = new GildedRose([
          new Item("+5 Dexterity Vest", 0, 20),
          new Item("Elixir of the Mongoose", -1, 7),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(18);
        expect(items[1].quality).to.equal(5);
      });

      it("Quality should never be negative", function () {
        const gildedRose = new GildedRose([
          new Item("+5 Dexterity Vest", 0, 1),
          new Item("Elixir of the Mongoose", -1, 0),
          new Item("Venomstrike", -20, -10),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(0);
        expect(items[1].quality).to.equal(0);
        expect(items[2].quality).to.equal(0);
      });

      it("Quality should never be more than 50", function () {
        const gildedRose = new GildedRose([
          new Item("+5 Dexterity Vest", 10, 60),
          new Item("Elixir of the Mongoose", 10, 51),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(50);
        expect(items[1].quality).to.equal(50);
      });
    });

    describe("Aged Brie", function () {
      it("Should increase in quality as it gets older", function () {
        const gildedRose = new GildedRose([
          new Item("Aged Brie", 2, 0),
          new Item("Aged Brie", -2, 1),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(1);
        expect(items[1].quality).to.equal(2);
      });

      it("Quality should never be more than 50", function () {
        const gildedRose = new GildedRose([new Item("Aged Brie", 2, 50)]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(50);
      });
    });

    describe("Sulfuras", function () {
      it("Should never decrease in quality", function () {
        const gildedRose = new GildedRose([
          new Item("Sulfuras, Hand of Ragnaros", 0, 80),
          new Item("Sulfuras, Hand of Ragnaros", -1, 80),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(80);
        expect(items[1].quality).to.equal(80);
      });

      it("Never alters", function () {
        const gildedRose = new GildedRose([
          new Item("Sulfuras, Hand of Ragnaros", 1, 80),
          new Item("Sulfuras, Hand of Ragnaros", 0, 80),
          new Item("Sulfuras, Hand of Ragnaros", -1, 80),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].sellIn).to.equal(1);
        expect(items[1].sellIn).to.equal(0);
        expect(items[2].sellIn).to.equal(-1);
      });

      it("Quality is always 80", function () {
        const gildedRose = new GildedRose([
          new Item("Sulfuras, Hand of Ragnaros", 0, 49),
          new Item("Sulfuras, Hand of Ragnaros", -1, 55),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(80);
        expect(items[1].quality).to.equal(80);
      });
    });

    describe("Backstage passes", function () {
      it("Should increase in quality as it gets older", function () {
        const gildedRose = new GildedRose([
          new Item("Backstage passes to a TAFKAL80ETC concert", 18, 20),
          new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(21);
        expect(items[1].quality).to.equal(21);
      });

      it("Quality increases by 2 when there are 10 days or less", function () {
        const gildedRose = new GildedRose([
          new Item("Backstage passes to a TAFKAL80ETC concert", 11, 20),
          new Item("Backstage passes to a TAFKAL80ETC concert", 7, 20),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(22);
        expect(items[1].quality).to.equal(22);
      });

      it("Quality increases by 3 when there are 5 days or less", function () {
        const gildedRose = new GildedRose([
          new Item("Backstage passes to a TAFKAL80ETC concert", 6, 20),
          new Item("Backstage passes to a TAFKAL80ETC concert", 1, 20),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(23);
        expect(items[1].quality).to.equal(23);
      });

      it("Quality should never be more than 50", function () {
        const gildedRose = new GildedRose([
          new Item("Backstage passes to a TAFKAL80ETC concert", 15, 49),
          new Item("Backstage passes to a TAFKAL80ETC concert", 11, 48),
          new Item("Backstage passes to a TAFKAL80ETC concert", 7, 49),
          new Item("Backstage passes to a TAFKAL80ETC concert", 6, 48),
          new Item("Backstage passes to a TAFKAL80ETC concert", 1, 48),
        ]);
        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(50);
        expect(items[1].quality).to.equal(50);
        expect(items[2].quality).to.equal(50);
        expect(items[3].quality).to.equal(50);
      });

      it("Should drop its quality to 0 after the concert", function () {
        const gildedRose = new GildedRose([
          new Item("Backstage passes to a TAFKAL80ETC concert", 0, 49),
          new Item("Backstage passes to a TAFKAL80ETC concert", -1, 49),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(0);
        expect(items[1].quality).to.equal(0);
      });
    });

    describe("Conjured items", function () {
      it("Should degrade twice as fast as normal items", function () {
        const gildedRose = new GildedRose([
          new Item("Conjured Mana Cake", 3, 6),
          new Item("Conjured Mana Cake", 0, 6),
          new Item("Conjured Mana Cake", -2, 6),
        ]);

        const items = gildedRose.updateQuality();

        expect(items[0].quality).to.equal(4);
        expect(items[1].quality).to.equal(2);
        expect(items[1].quality).to.equal(2);
      });
    });
  });
});
