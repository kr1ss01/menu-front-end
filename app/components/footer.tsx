"use client"

import * as React from 'react';
import style from '@/styles/components/footer/index.module.scss';
import Logo from '@/helpers/logo.help';
import { FacebookSquareSVG, InstagramSquareSVG, MapSVG, PhoneSVG, ShoppingCartSVG, TikTokSVG } from '@/svg';
import Colors from '@/types/colors';

export default function Footer() {
    return (
        <footer className={style.footerMain}>
            <div className={style.footerMainWidth}>
                <div className={style.footerCol1}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.133439971085!2d22.910916399999998!3d40.671028699999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14a8399ca2747d4b%3A0x113a03aa58bd57c0!2zzpzOsc-Nz4HOvyDPgM65z4DOrc-Bzrkg77iP!5e0!3m2!1sen!2sgr!4v1731624022877!5m2!1sen!2sgr"
                        width="250"
                        height="250"
                        style={{ border: 0, borderRadius: '5px' }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>
                <div className={style.footerCol2}>
                    <Logo align='flex-start' justify='center' margin={0} mode='dark' />
                    <div className={style.showUsLove}>
                        <h2>Αγαπήστε μας:</h2>
                        <div className={style.showUsLove_icons}>
                            <a href="https://www.instagram.com/mavropiperiskg" target="_blank" rel="noopener noreferrer" className={style.instagram}>
                                <InstagramSquareSVG box={1.5} color={Colors.white} />
                            </a>
                            <a href="http://www.facebook.com/mavropiperiskg/" target="_blank" rel="noopener noreferrer">
                                <FacebookSquareSVG box={1.5} color={Colors.facebook} />
                            </a>
                            <a href="https://www.tiktok.com/@mavropiperi_skg" target='_blank' rel='noopener noreferrer'>
                                <TikTokSVG box={1.3} color={Colors.tiktok} />
                            </a>
                        </div>
                    </div>
                    <div className={style.footerCol2Info}>
                        <p>
                            <PhoneSVG box={1} color={Colors.black} />
                            <span>2310 765 566</span>
                        </p>
                        <p>
                            <MapSVG box={1.1} color={Colors.black} />
                            <span>Αχιλλέως 32, Εύοσμος, Θεσσαλονίκη</span>
                        </p>
                        <p>
                            <ShoppingCartSVG box={1.3} color={Colors.black} />
                            <span>Αγοραστικός υπεύθυνος: Κύριλλος Καρυπίδης.</span>
                        </p>
                        {/* <p className={style.footerCol2InfoPrice}>Οι τιμές καταλόγου ενδέχεται να αλλάξουν χωρις καμία προειδοποίηση!</p> */}
                    </div>
                </div>
            </div>
            <small>Μαύρο Πιπέρι Ε.Ε. 2025 &copy; All Rights Reserved</small>
        </footer>
    );
}