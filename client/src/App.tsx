import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// React-Quill 및 브라우저 경고 전역 제거
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  const originalError = console.error;
  const originalLog = console.log;

  // console.warn 필터링
  console.warn = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('findDOMNode is deprecated') ||
      message.includes('ReactDOM.findDOMNode') ||
      message.includes('DOMNodeInserted') ||
      message.includes('mutation event') ||
      message.includes('Deprecation') ||
      message.includes('Support for this event type has been removed')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // console.error 필터링
  console.error = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('findDOMNode is deprecated') ||
      message.includes('ReactDOM.findDOMNode') ||
      message.includes('DOMNodeInserted')
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  // console.log 필터링 (일부 경고가 log로 출력될 수 있음)
  console.log = (...args) => {
    const message = args[0]?.toString() || '';
    if (
      message.includes('DOMNodeInserted') ||
      message.includes('mutation event') ||
      message.includes('Deprecation')
    ) {
      return;
    }
    originalLog.apply(console, args);
  };
}
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import Brand from "@/pages/brand";
import Stores from "@/pages/stores";
import Reviews from "@/pages/reviews";
import B2B from "@/pages/b2b";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Admin from "@/pages/admin";
import ProductAdmin from "@/pages/product-admin";
import NaverCallback from "@/pages/naver-callback";
import MyPage from "@/pages/mypage";
import MyPageTest from "@/pages/mypage-test";
import OrderDetail from "@/pages/order-detail";
import { Header } from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { AnimatePresence } from "framer-motion";

function Router() {
  const [location] = useLocation();
  
  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/brand" component={Brand} />
          <Route path="/stores" component={Stores} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/b2b" component={B2B} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/admin" component={Admin} />
          <Route path="/product-admin" component={ProductAdmin} />
          <Route path="/mypage/:section?" component={MyPage} />
          <Route path="/mypage/order/:orderId" component={OrderDetail} />
          <Route path="/mypage-test" component={MyPageTest} />
          <Route path="/auth/naver/callback" component={NaverCallback} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
