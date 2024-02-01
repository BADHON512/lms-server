import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/CatchAsyncErros";
import Errorhandler from "../Utils/Errorhandler";
import LayoutModel from "../models/layout.model";

export const createLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exist = await LayoutModel.findOne({ type: req.body.type });
      if (exist) {
        return next(
          new Errorhandler(`${req.body.type} Layout already exist`, 400)
        );
      }

      const { type } = req.body;

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;

        const photo = await cloudinary.v2.uploader.upload(image, {
          folder: "Banner",
        });
        console.log("photo", photo);
        const banner = {
          type: "Banner",
          banner: {
            image: {
              public_id: photo.public_id,
              url: photo.secure_url,
            },
            title,
            subTitle,
          },
        };

        await LayoutModel.create(banner);
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        console.log(req.body);

        const faqItem = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        console.log(faqItem);
        await LayoutModel.create({ type: "FAQ", faq: faqItem });

        res.status(201).json({
          success: true,
          message: "FAQ created successfully",
        });
      }

      if (type === "Category") {
        const { categories } = req.body;
        const categoryItem = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          })
        );
        await LayoutModel.create({
          type: "Category",
          categories: categoryItem,
        });
        res.status(201).json({
          success: true,
          message: "Category created successfully",
        });
      }
      res.status(201).json({
        success: true,
        message: "Layout created successfully",
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 404));
    }
  }
);

export const EditLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;

        const banner: any = await LayoutModel.findOne({ type: type });
        if (!banner) {
          return next(new Errorhandler("Banner not found", 404));
        }
        if (banner) {
          await cloudinary.v2.uploader.destroy(banner.image.public_id);
        }
        const photo = await cloudinary.v2.uploader.upload(image, {
          folder: "Banner",
        });

        const newBanner = {
          image: {
            public_id: photo.public_id,
            url: photo.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.findOneAndUpdate({ type: "Banner" }, newBanner, {
          new: true,
        });

        res.status(201).json({
          success: true,
          message: "Banner updated successfully",
        });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const banner = await LayoutModel.findOne({ type: type });
        if (!banner) {
          return next(new Errorhandler("Faq not found", 404));
        }
        const faqItem = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          })
        );
        banner.faq = faqItem;
        await banner.save();
        res.status(201).json({
          success: true,
          message: "FAQ updated successfully",
        });
      }

      if (type === "Category") {
        const { categories } = req.body;

        const category = await LayoutModel.findOne({ type: type });
        if (!category) {
          return next(new Errorhandler("Category not found", 404));
        }
        const categoryItem = await Promise.all(
          categories.map((item: any) => {
            return {
              title: item.title,
            };
          })
        );

        //    category.categories=categoryItem
        //    await category.save()

        await LayoutModel.findByIdAndUpdate(category._id, {
          type: "Category",
          categories: categoryItem,
        });

        res.status(201).json({
          success: true,
          message: "Category Update successfully",
        });
      }
    } catch (error: any) {
      return next(new Errorhandler(error.message, 404));
    }
  }
);

export const getLayout = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      const layouts = await LayoutModel.find({ type: type });
      res.status(201).json({
        success: true,
        layouts,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 404));
    }
  }
);
