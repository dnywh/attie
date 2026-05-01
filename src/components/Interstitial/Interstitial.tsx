import type { PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";
import { styled } from "next-yak";
import {
  smallText,
  veryBasicCardStyle,
  interstitialStippledBackground,
  bleedingWhiteCard,
  dashedBorder,
} from "@/styles/commonStyles";
import { webTheme } from "@/styles/theme.yak";

const Aside = styled.aside`
  ${dashedBorder};
`;

const Visible = styled.div`
  ${veryBasicCardStyle};
  ${interstitialStippledBackground};
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-top: 3.25rem;
  padding: 1rem;
  position: relative;

  &::after {
    background-image: url("/images/boys-test-a.png");
    background-position-x: 55%;
    background-repeat: no-repeat;
    background-size: contain;
    content: "";
    height: 88px;
    left: 0;
    position: absolute;
    top: -67px;
    width: 100%;
  }

  & > h2,
  & > a {
    ${smallText};
    text-align: center;
  }

  & > h2 {
    font-weight: 500;
  }

  & > a {
    font-style: italic;
    font-weight: 600;
    transition: transform 180ms ${webTheme.curves.spring.heavy};

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const Inner = styled.div`
  ${bleedingWhiteCard};
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem 1.25rem;

  & > p {
    text-align: center;

    & > a {
      font-style: italic;
      font-weight: 600;
      transition:
        opacity 200ms ${webTheme.curves.ease.basic},
        transform 180ms ${webTheme.curves.spring.heavy};

      &:hover {
        opacity: 0.5;
      }
    }
  }
`;

interface InterstitialProps {
  intro?: string;
  linkUrl?: string;
  linkText?: string;
}

function Interstitial({
  intro = "Did you know?",
  linkUrl,
  linkText,
  children,
}: PropsWithChildren<InterstitialProps>) {
  return (
    <Aside>
      <Visible>
        <h2>{intro}</h2>

        <Inner>
          <Image
            src="/images/eye.svg"
            width={64}
            height={64}
            alt="An eye shape with an at-symbol instead of a pupil"
          />
          {children}
        </Inner>
        {linkUrl && (
          <Link
            href={`${linkUrl}?utm_source=attie&utm_medium=sponsorship`}
            target="_blank"
          >
            {linkText ? linkText : "Learn more"}
          </Link>
        )}
      </Visible>
    </Aside>
  );
}

export default Interstitial;
