"use client"

import * as React from 'react';
import styles from "@/styles/pages/index/index.module.scss";
import { useQuery } from "@tanstack/react-query";
import Category from "@/types/categories";
import { getCategories } from "@/axios/categories";
import LoadingSpinner from "@/helpers/loading";
import { BugSVG } from "@/svg";
import Colors from "@/types/colors";
import { PlateCategoriesSimple, PlateComplex } from '@/types/plate';
import { getPlatesByCategorySimple } from '@/axios/complex';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { data: categories, isLoading, isError, refetch: refetchCat } = useQuery<Category[]>({
      queryKey: ['get-all-categories-main'],
      queryFn: async () => {
          return (await getCategories()).reverse();
      }
  });

  const { data: catPlates, isLoading: isLoadingPlates, isError: isErrorPlates, refetch: refetchPl } = useQuery<PlateCategoriesSimple[]>({
    queryKey: ['get-complex-plates-main'],
    queryFn: async () => {
      return await getPlatesByCategorySimple();
    }
  });

  const [active, setActive] = React.useState<Category | undefined>(undefined);
  const [activePlates, setActivePlates] = React.useState<PlateComplex[]>([]);

  React.useEffect(() => {
    if (!catPlates) return;
    if (active) {
      catPlates.forEach((plate: PlateCategoriesSimple) => {
        if (plate.category === active.name) {
          plate.plates.forEach((pl: PlateComplex) => {
            setActivePlates(curr => [...curr, pl]);
          })
        }
      });
    }
    if (!active) {
      setActivePlates([]);
    }
  }, [active]);

  const handleClickOnCategory = (cat: Category) => {
    if (active?._id === cat._id) {
      setActive(undefined);
      setActivePlates([]);
    }

    if (active?._id !== cat._id) {
      setActive(cat);
      setActivePlates([]);
    }

    if (!active) {
      setActive(cat);
    }
  }

  const handlePrice = (price: number) => {
    if (price % 1 == 0) return `${price}.00`;
    return `${price}0`;
  }

  return (
    <div className={styles.index}>
      {/* {isLoadingPlates && 
        <div className={styles.loading}>
          <LoadingSpinner />
          <p>Φόρτωση...</p>
        </div>
      } */}
      {/* {(isErrorPlates || isError) &&
        <div className={styles.loading}>
          <div className={styles.bugDiv}>
            <BugSVG box={3} color={Colors.black} />
          </div>
          <p>Απροσδιόριστο Σφάλμα!</p>
          <button onClick={() => {isError ? refetchCat() : refetchPl() }} type="button" role="button" className={styles.refetchCatButton}>
            Προσπαθήστε Ξανά
          </button>
        </div>
      } */}
      {(categories && !isLoading && !isError) &&
      <div className={styles.categories}>
          {categories.map((cat: Category, key: number) => {
            if (!cat.visible) return;
            return (
              <section key={key}>
                <Link href={'/#' + key} passHref>
                  <div id={`${cat.order}`} className={styles.categoriesView} onClick={() => handleClickOnCategory(cat)}>
                    {cat.name}
                  </div>
                </Link>
                {(active?._id === cat._id && activePlates) &&
                  <ul className={styles.plateContainer}>
                    {activePlates.map((pl: PlateComplex, key2: number) => {
                      if (!pl.visible || !pl.availability || pl.onlyOnSpecial) return;
                      if (pl.showIcon && pl.image && pl.imageMimeType) {
                        // ! RETURN PLATE WITH IMAGE
                        return (
                          <li
                            key={key2}
                            className={styles.plateWithImage}
                            >
                              <div
                                className={styles.imageBackface}
                                style={{ 
                                  backgroundImage: `url(data:${pl.imageMimeType};base64,${Buffer.from(pl.image).toString('base64')})`,
                                  backgroundSize: 'cover',
                                  WebkitBackgroundSize: 'cover',
    
                                }}
                              >
                              </div>
                            <div className={styles.plateInfo}>
                              <p>{pl.name}</p>
                              {pl.showGarnet && <span>{pl.garnet.name}</span>}
                              {pl.showDesc && <span>{pl.desc}</span>}
                              {pl.showPrice && 
                                <span className={styles.platePrice}>
                                  {handlePrice(pl.price)}&euro; {pl.kiloPrice && '/κιλό'}
                                </span>
                              }
                            </div>
                          </li>
                        )
                      } else {
                        // ! RETURN PLATE NO IMAGE
                        return (
                          <li key={key} className={styles.plateNoImage}>
                            <p>{pl.name}</p>
                            {pl.showGarnet && <span>{pl.garnet.name}</span>}
                            {pl.showDesc && <span>{pl.desc}</span>}
                            {pl.showPrice && 
                              <span className={styles.platePrice}>
                                {handlePrice(pl.price)}&euro; {pl.kiloPrice && '/κιλό'}
                              </span>
                            }
                          </li>
                        );
                      }
                    })}
                  </ul>
                }
              </section>
            )
          })}
      </div>
      }
    </div>
  );
}
