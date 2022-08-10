import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavTitle } from "../navigation";

type SetPageTitleCleanup = () => void;
type SetPageTitle = (pageTitle: string) => SetPageTitleCleanup;

export type PageTitleContextValue = {
  pageTitle: string;
  setPageTitle: SetPageTitle;
};
const PageTitleContext = createContext<PageTitleContextValue>({
  pageTitle: "",
  setPageTitle: () => () => {},
});
/**
 * Given props, returns a provider that shares a pageTitle value and
 * setPageTitle function which can be consumed and called using the hooks
 * {@linkcode usePageTitle} and {@linkcode useSetPageTitle}, respectively.
 * The pageTitle will be {@linkcode useNavTitle}-based when no child node
 * utilizes the {@linkcode useSetPageTitle} hook. Otherwise the pageTitle
 * will reflect the value most recently set by the {@linkcode useSetPageTitle}
 * hook.
 *
 * @param props
 * @param props.children the child nodes which will be provided pageTitle and
 *   setPageTitle
 * @returns a provider that shares a pageTitle value and a setPageTitle
 *   function which can be consumed and called using the hooks
 *   {@linkcode usePageTitle} and {@linkCode useSetPageTitle}, respectively.
 */
export const PageTitleProvider: FC = ({ children }) => {
  const [consumerPageTitle, setConsumerPageTitle] = useState<
    PageTitleContextValue["pageTitle"] | undefined
  >(undefined);

  const navTitle = useNavTitle();

  const pageTitleContextValue: PageTitleContextValue = {
    pageTitle: consumerPageTitle || navTitle || "",
    setPageTitle: (pageTitle: string) => {
      setConsumerPageTitle(pageTitle);
      return () => setConsumerPageTitle(undefined);
    },
  };

  return (
    <PageTitleContext.Provider value={pageTitleContextValue}>
      {children}
    </PageTitleContext.Provider>
  );
};

/**
 * Returns the pageTitle from the {@linkcode PageTitleProvider}. The pageTitle
 * will be {@linkcode useNavTitle}-based when no child node utilizes the
 * {@linkcode useSetPageTitle} hook. Otherwise the pageTitle will reflect the
 * value most recently set by the {@linkcode useSetPageTitle} hook.
 *
 * @returns the pageTitle from the {@linkcode PageTitleProvider}. The pageTitle
 * will be {@linkcode useNavTitle}-based when no child node utilizes the
 * {@linkcode useSetPageTitle} hook. Otherwise the pageTitle will reflect the
 * value most recently set by the {@linkcode useSetPageTitle} hook.
 */
export const usePageTitle = () => useContext(PageTitleContext).pageTitle;

/**
 * Sets the pageTitle in the {@linkcode PageTitleProvider} such that the
 * {@linkcode usePageTitle} hook will return the specified value.
 */
export const useSetPageTitle = (pageTitle: string) => {
  const { setPageTitle } = useContext(PageTitleContext);
  useEffect(() => setPageTitle(pageTitle), [pageTitle, setPageTitle]);
};
