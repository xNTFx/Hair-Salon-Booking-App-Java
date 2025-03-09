import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import { EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "./HomePage.css";

export default function HomePage() {
  return (
    <>
      <div className="homepage">
        <div className="homepage__text">
          <h1 className="homepage__headline">
            Ready for a fresh look? Book your appointment now!
          </h1>
          <Link to="services" className="homepage__btn">
            Book
          </Link>
        </div>
        <Swiper
          spaceBetween={0}
          effect={"fade"}
          centeredSlides={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loop={true}
          modules={[Autoplay, EffectFade]}
          className="homepage__swiper"
        >
          <SwiperSlide className="homepage__slide">
            <img
              loading="eager"
              src="blonde-girl-getting-her-hair-done.webp"
              alt="Blonde girl getting her hair done"
              className="homepage__image"
            />
          </SwiperSlide>
          <SwiperSlide className="homepage__slide">
            <img
              loading="eager"
              src="hairdresser-taking-care-her-client.webp"
              alt="Hairdresser taking care of her client"
              className="homepage__image"
            />
          </SwiperSlide>
          <SwiperSlide className="homepage__slide">
            <img
              loading="eager"
              src="woman-getting-her-hair-cut-beauty-salon.webp"
              alt="Woman getting her hair cut at a beauty salon"
              className="homepage__image"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </>
  );
}
