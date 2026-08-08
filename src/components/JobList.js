import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FadeInSection from "./FadeInSection";

const HORIZONTAL_BREAKPOINT = 600;

// Read live rather than once at import time, so rotating a phone or resizing
// actually switches the tab layout.
function useIsHorizontal() {
  const [isHorizontal, setIsHorizontal] = React.useState(
    () => window.innerWidth < HORIZONTAL_BREAKPOINT
  );

  React.useEffect(() => {
    const onResize = () => {
      setIsHorizontal(window.innerWidth < HORIZONTAL_BREAKPOINT);
    };

    window.addEventListener("resize", onResize, { passive: true });
    onResize();

    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isHorizontal;
}

function TabPanel(props) {
  const { children, value, index, isHorizontal, ...other } = props;

  if (isHorizontal) {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography component="div">{children}</Typography>
          </Box>
        )}
      </div>
    );
  } else {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography component="div">{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  isHorizontal: PropTypes.bool,
};

function a11yProps(index, isHorizontal) {
  if (isHorizontal) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  } else {
    return {
      id: `vertical-tab-${index}`,
    };
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "theme.palette.background.paper",
    display: "flex",
    height: 300,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const JobList = () => {
  const classes = useStyles();
  const isHorizontal = useIsHorizontal();
  const [value, setValue] = React.useState(0);

  const experienceItems = {
    Outlier: {
      jobTitle: "AI Trainer @",
      duration: "OCT 2024 - DEC 2025",
      desc: [
        "Delivered high-quality outputs for LLM evaluation, prompt optimization, and AI model fine-tuning using Reinforcement Learning with Human Feedback (RLHF).",
        "Completed 1000+ AI focused tasks, including algorithm design and model behavior debugging, earning over $3,000 in performance-based payouts. ",
      ],
    },
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation={isHorizontal ? "horizontal" : "vertical"}
        variant="scrollable"
        scrollButtons="auto"
        value={value}
        onChange={handleChange}
        className={classes.tabs}
      >
        {Object.keys(experienceItems).map((key, i) => (
          <Tab key={key} label={key} {...a11yProps(i, isHorizontal)} />
        ))}
      </Tabs>
      {Object.keys(experienceItems).map((key, i) => (
        <TabPanel key={key} value={value} index={i} isHorizontal={isHorizontal}>
          <span className="joblist-job-title">
            {experienceItems[key]["jobTitle"] + " "}
          </span>
          <span className="joblist-job-company">{key}</span>
          <div className="joblist-duration">
            {experienceItems[key]["duration"]}
          </div>
          <ul className="job-description">
            {experienceItems[key]["desc"].map(function (descItem, i) {
              return (
                <FadeInSection as="li" key={descItem} delay={`${i + 1}00ms`}>
                  {descItem}
                </FadeInSection>
              );
            })}
          </ul>
        </TabPanel>
      ))}
    </div>
  );
};

export default JobList;
