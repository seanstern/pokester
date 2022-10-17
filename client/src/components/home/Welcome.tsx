import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";
import { PokerRooms } from "@pokester/common-api";
import { FC, useEffect, useState } from "react";
import {
  isAuthStatusResult,
  useAuthStatus,
  AuthStatus,
} from "../../queries/user";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const alertBodyPreSignup =
  "Pokester is currently in closed beta testing. Sign up for the waitlist if you'd like to be considered as a potential beta tester.";
const alertBodyPostSignup =
  "Thanks for signing up to beta test Pokester. Feel free to invite your friends to sign up too.";

const mailtoSubject = "Beta Test an App With Me";
const mailtoCC = "contact@playpokester.com";
const mailtoBodyPrefix = `I recently signed up to beta test Pokester--a free app for playing poker with friends using play money.\n\n Sign up to beta test with me at ${process.env.REACT_APP_BASE_URL}`;
const inviteMailTo = `mailto:?cc=${encodeURIComponent(
  mailtoCC
)}&subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(
  `${mailtoBodyPrefix}`
)}`;

const hrefPreSignup = "/account/signup";
const hrefPostSignup = inviteMailTo;

const startIconPreSignup = undefined;
const startIconPostSignup = <MailOutlineIcon />;

const buttonLabelPreSignup = "Sign up";
const buttonLabelPostSignup = "Invite";

const preSignupProps = {
  alertBody: alertBodyPreSignup,
  href: hrefPreSignup,
  startIcon: startIconPreSignup,
  buttonLabel: buttonLabelPreSignup,
};
const postSignupProps = {
  alertBody: alertBodyPostSignup,
  href: hrefPostSignup,
  startIcon: startIconPostSignup,
  buttonLabel: buttonLabelPostSignup,
};

/**
 * Returns 5 cards at random.
 *
 * @returns 5 cards at random.
 */
const generateHand = () =>
  Object.values(PokerRooms.Get.CardRank)
    .flatMap((rank) =>
      ["♣", "♦", "♥", "♠"].map((suit) => ({
        value: `${rank}${suit}`,
        color: ["♦", "♥"].includes(suit)
          ? PokerRooms.Get.CardColor.RED
          : PokerRooms.Get.CardColor.BLACK,
        comparator: Math.random(),
      }))
    )
    .sort((a, b) => a.comparator - b.comparator)
    .slice(-5);

const transitionTimeMs = 500;

/**
 * Returns the welcome section of the home page.
 *
 * @returns the welcome section of the home page.
 */
const Welcome: FC = () => {
  const authStatusQuery = useAuthStatus();
  const [hand] = useState(generateHand);
  const [initialTransitionIn, setInitialTransitionIn] = useState(false);
  useEffect(() => {
    setTimeout(() => setInitialTransitionIn(true), transitionTimeMs);
  }, []);

  const isPreSignup = !(
    isAuthStatusResult(authStatusQuery) &&
    [
      AuthStatus.AUTHENTICATED,
      AuthStatus.REGISTERED,
      AuthStatus.AUTHORIZED,
    ].includes(authStatusQuery.data)
  );
  const isPostSignup = !isPreSignup;
  const alertTransitionIn = initialTransitionIn || isPostSignup;
  const signupStatusBasedProps = isPreSignup ? preSignupProps : postSignupProps;

  return (
    <>
      <Typography
        variant="h3"
        component="h2"
        color="primary.main"
        fontWeight="bold"
        textAlign="center"
      >
        Free.&nbsp;
        <wbr />
        No&#x2011;Stakes.&nbsp;
        <wbr />
        Poker.
      </Typography>
      <Typography
        variant="h5"
        component="p"
        color="primary.light"
        textAlign="center"
      >
        for you and your friends
      </Typography>
      <Box display="flex" justifyContent="center" my={1}>
        {hand.map((card, idx) => (
          <Slide
            key={idx}
            direction={"down"}
            in={initialTransitionIn}
            style={{
              transitionDelay: `${(idx + 1) * transitionTimeMs}ms`,
            }}
            timeout={transitionTimeMs * (1 + idx / hand.length)}
          >
            <Paper
              elevation={4}
              sx={{
                bgcolor: "white",
                ml: -idx * 0.25,
                px: 1,
                py: 1.5,
                zIndex: idx + 1,
              }}
            >
              <Typography color={card.color} component="p" variant="h4">
                {card.value}
              </Typography>
            </Paper>
          </Slide>
        ))}
      </Box>
      <Typography variant="body1" component="p" my={2} textAlign="center">
        Play no-limit{" "}
        <Link
          href="https://en.wikipedia.org/wiki/Texas_hold_'em"
          target="_blank"
        >
          Texas hold'em
        </Link>{" "}
        for free with your friends using play money--on your computer, tablet,
        or phone.
      </Typography>
      <Box alignItems="center" display="flex" flexDirection="column" mt={2}>
        <Collapse in={alertTransitionIn} mountOnEnter>
          <Alert severity="info" sx={{ my: 1 }}>
            <AlertTitle>Closed Beta in Progress</AlertTitle>
            {signupStatusBasedProps.alertBody}
          </Alert>
        </Collapse>
        <Button
          variant="contained"
          href={signupStatusBasedProps.href}
          size="large"
          startIcon={signupStatusBasedProps.startIcon}
          sx={{ my: 1 }}
        >
          {signupStatusBasedProps.buttonLabel}
        </Button>
      </Box>
    </>
  );
};

export default Welcome;
