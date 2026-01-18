import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";
import { useEffect } from "react";
import { PageSEO } from '@/components/seo/page-seo';
import { seoData } from '@/lib/seo-data';

const Support = () => {
    const [location] = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const getContent = () => {
        switch (location) {
            case "/faq":
                return {
                    title: "자주 묻는 질문",
                    subtitle: "고객님들이 자주 문의하시는 내용입니다.",
                    content: (
                        <div className="space-y-6">
                            <div className="border-b border-border pb-4">
                                <h3 className="font-montserrat font-semibold text-lg mb-2">Q. 배송은 얼마나 걸리나요?</h3>
                                <p className="text-muted-foreground">A. 주문하신 제품은 신선도 유지를 위해 당일 생산, 당일 발송을 원칙으로 하며, 보통 발송 다음 날 수령 가능합니다 (주말/공휴일 제외).</p>
                            </div>
                            <div className="border-b border-border pb-4">
                                <h3 className="font-montserrat font-semibold text-lg mb-2">Q. 보관 방법이 궁금합니다.</h3>
                                <p className="text-muted-foreground">A. 방부제가 없는 제품이므로 수령 즉시 드시는 것이 가장 좋습니다. 바로 드시지 않을 경우 밀봉하여 냉동 보관 후, 드시기 전 자연 해동이나 오븐/에어프라이어에 데워 드시길 권장합니다.</p>
                            </div>
                            <div className="border-b border-border pb-4">
                                <h3 className="font-montserrat font-semibold text-lg mb-2">Q. 단체 주문도 가능한가요?</h3>
                                <p className="text-muted-foreground">A. 네, 최소 3일 전 홈페이지 상단의 B2B 문의나 고객센터를 통해 연락 주시면 상담 후 진행 도와드립니다.</p>
                            </div>
                        </div>
                    )
                };
            case "/shipping":
                return {
                    title: "배송 안내",
                    subtitle: "더 온밀의 배송 정책을 안내해 드립니다.",
                    content: (
                        <div className="space-y-6">
                            <div className="bg-secondary p-6 rounded-lg">
                                <h3 className="font-montserrat font-bold text-lg mb-4">배송 정보</h3>
                                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                    <li>배송사: 우체국 택배 / CJ 대한통운</li>
                                    <li>배송 지역: 전국 (제주 및 도서 산간 지역은 추가 배송비 발생)</li>
                                    <li>배송 비용: 3,000원 (50,000원 이상 구매 시 무료)</li>
                                    <li>배송 마감: 평일 오전 10시 이전 결제 완료 건 당일 발송</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-montserrat font-bold text-lg mb-4">주의사항</h3>
                                <p className="text-muted-foreground">식품 특성상 고객님의 부재, 주소 불분명, 연락처 오기재로 인한 반송 시 환불이 불가하니 정확한 정보 입력을 부탁드립니다.</p>
                            </div>
                        </div>
                    )
                };
            case "/returns":
                return {
                    title: "교환 및 환불",
                    subtitle: "제품에 문제가 있으신가요?",
                    content: (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-montserrat font-bold text-lg mb-4">교환/반품 안내</h3>
                                <p className="text-muted-foreground mb-4">신선 식품의 특성상 단순 변심에 의한 교환/반품은 불가합니다. 단, 제품의 하자가 있거나 배송 중 파손된 경우에는 수령 후 24시간 이내에 사진과 함께 고객센터로 연락 주시면 신속하게 처리해 드립니다.</p>
                            </div>
                            <div className="bg-secondary p-6 rounded-lg">
                                <h3 className="font-montserrat font-bold text-lg mb-4">접수 방법</h3>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>제품 사진 촬영 (하자 부분, 박스 포장 상태)</li>
                                    <li>고객센터 (031-938-2590) 또는 카카오톡 채널로 접수</li>
                                    <li>담당자 확인 후 교환 또는 환불 진행</li>
                                </ol>
                            </div>
                        </div>
                    )
                };
            case "/privacy":
                return {
                    title: "개인정보 처리방침",
                    subtitle: "고객님의 소중한 정보를 안전하게 보호합니다.",
                    content: (
                        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
                            <h4 className="font-bold text-foreground text-lg">개인정보 처리방침</h4>
                            <p>주식회사 신화베이커리(이하 “회사”)은 『개인정보보호법』제30조(개인정보 처리방침의 수립 및 공개)에 따라 정보주체의 개인정보를 보호하고 이와 관련한 문제를 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립.공개합니다.</p>

                            <p>개인정보 처리방침은 정부의 법령이나 지침의 변경 또는 더 나은 서비스의 제공을 위하여 그 내용이 변경될 수 있습니다. 이 경우 회사가 보유한 웹사이트 또는 모바일 어플리케이션을 통하여 이용자에게 공지하고 있습니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제1조 (개인정보의 처리 목적)</h5>
                            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                <li>회원가입 및 관리</li>
                                <li>고객상담 처리</li>
                                <li>민원사무 처리</li>
                                <li>재화 또는 서비스 제공</li>
                                <li>마케팅 및 광고에의 활용</li>
                            </ul>

                            <h5 className="font-bold text-foreground mt-6 text-base">제2조 (개인정보의 수집, 이용목적, 항목 및 보유기간)</h5>
                            <p>회사는 법령에 따른 개인정보 보유.이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유.이용기간 내에서 개인정보를 처리.보유합니다.</p>
                            <div className="mt-2 border border-border rounded p-4 bg-background">
                                <p className="font-semibold text-foreground mb-2">[회원가입]</p>
                                <ul className="list-disc list-inside">
                                    <li>필수항목: 성명, ID, 비밀번호, 휴대전화번호, 이메일, 생년월일</li>
                                    <li>보유기간: 회원탈퇴 시 지체없이 파기</li>
                                </ul>
                                <p className="font-semibold text-foreground mt-4 mb-2">[물품 구매 및 환불]</p>
                                <ul className="list-disc list-inside">
                                    <li>필수항목: 주문자 정보, 배송 정보, 결제 내역</li>
                                    <li>보유기간: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                                </ul>
                            </div>

                            <h5 className="font-bold text-foreground mt-6 text-base">제3조(만14세 미만 아동의 개인정보 처리에 관한 사항)</h5>
                            <p>회사는 만14세 미만 아동에 대해 개인정보를 수집하지 않습니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제4조(개인정보처리의 위탁에 관한 사항)</h5>
                            <p>회사는 원활한 업무 수행을 위하여 다음과 같이 개인정보 처리업무를 외부 전문업체에 위탁하고 있습니다.</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>위탁받는 자 (수탁자): CJ대한통운, 우체국택배</li>
                                <li>위탁하는 업무: 상품 배송 업무</li>
                                <li className="mt-1">위탁받는 자 (수탁자): (주)케이지이니시스, 네이버페이, 카카오페이</li>
                                <li>위탁하는 업무: 결제 대행</li>
                            </ul>

                            <h5 className="font-bold text-foreground mt-6 text-base">제5조(개인정보처리의 제3자 제공)</h5>
                            <p>회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우에는 예외로 합니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제6조(개인정보의 파기절차 및 파기방법)</h5>
                            <p>회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 전자적 파일 형태는 복구할 수 없는 기술적 방법을 사용하며, 종이 문서 등은 분쇄하거나 소각합니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제7조(정보주체의 권리.의무 및 그 행사방법)</h5>
                            <p>정보주체는 회사에 대해 언제든지 개인정보 열람.정정.삭제.처리정지 요구 등의 권리를 행사할 수 있습니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제8조(개인정보의 안전성 확보조치)</h5>
                            <p>회사는 개인정보의 안전성 확보를 위해 정기적인 자체 감사, 직원의 최소화 및 교육, 내부관리계획 수립, 해킹 대비 기술적 대책(암호화 등)을 시행하고 있습니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제9조(개인정보 보호책임자)</h5>
                            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                            <div className="mt-2 p-4 bg-secondary rounded">
                                <p><strong>성명:</strong> 유해숙 대표</p>
                                <p><strong>연락처:</strong> 031-938-2590 / yhs85844@gmail.com</p>
                            </div>

                            <h5 className="font-bold text-foreground mt-6 text-base">제10조(권익침해 구제방법)</h5>
                            <p>개인정보침해로 인한 신고나 상담이 필요하신 경우 아래 기관에 문의하시기 바랍니다.</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>개인정보분쟁조정위원회 (1833-6972)</li>
                                <li>개인정보침해신고센터 (118)</li>
                            </ul>

                            <h5 className="font-bold text-foreground mt-6 text-base">제11조(개인정보 처리방침의 개정과 공지)</h5>
                            <p>이 개인정보처리방침은 2026년 1월 1일부터 적용됩니다.</p>
                            <p className="mt-4 text-right font-medium">시행일자: 2026년 1월 1일</p>
                        </div>
                    )
                };
            case "/terms":
                return {
                    title: "이용약관",
                    subtitle: "더 온밀 서비스 이용에 대한 약관입니다.",
                    content: (
                        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
                            <h4 className="font-bold text-foreground text-lg">서비스 이용약관</h4>

                            <h5 className="font-bold text-foreground mt-6 text-base">제1조 (목적)</h5>
                            <p>본 약관은 더 온밀 통합회원(이하 “회원”이라 함)이 주식회사 신화베이커리(이하 “당사”라 함)가 제공하는 더 온밀 서비스를 이용함에 있어 회원과 당사의 제반 권리.의무 및 관련절차 등을 규정하는데 그 목적이 있습니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제2조 (용어의 정의)</h5>
                            <p>① “이용자”란 본 약관을 따라 당사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</p>
                            <p>② “회원”이란 더 온밀 서비스를 정상적으로 이용할 수 있는 권한을 부여 받은 분으로서 본 약관을 승인하고, 당사에 회원등록한 분을 말합니다.</p>
                            <p>③ “서비스”란 당사가 인터넷 사이트 및 모바일 어플리케이션을 통하여 제공하는 재화의 판매 및 포인트 적립 등 제반 서비스를 말합니다.</p>
                            <p>④ “포인트”란 당사가 본 약관에 정한 바에 따라 제공하는 포인트를 말합니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제3조 (서비스의 내용)</h5>
                            <p>당사가 제공하는 서비스는 다음과 같습니다.</p>
                            <ul className="list-disc list-inside mt-2">
                                <li>재화 또는 용역에 대한 정보 제공 및 구매계약의 체결</li>
                                <li>구매계약이 체결된 재화 또는 용역의 배송</li>
                                <li>포인트 적립 및 사용 서비스</li>
                                <li>기타 당사가 정하는 업무</li>
                            </ul>

                            <h5 className="font-bold text-foreground mt-6 text-base">제4조 (회원가입)</h5>
                            <p>① 이용자는 당사가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로서 회원가입을 신청합니다.</p>
                            <p>② 만 14세 미만인 아동은 법정대리인의 동의를 얻은 후에만 회원가입이 가능합니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제5조 (회원탈퇴 및 자격 상실)</h5>
                            <p>① 회원은 언제든지 탈퇴를 요청할 수 있으며 당사는 즉시 회원탈퇴를 처리합니다.</p>
                            <p>② 회원이 다음 각 호의 사유에 해당하는 경우, 당사는 회원자격을 제한 및 정지시킬 수 있습니다.</p>
                            <ul className="list-disc list-inside mt-1 pl-4">
                                <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                                <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                                <li>법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                            </ul>

                            <h5 className="font-bold text-foreground mt-6 text-base">제6조 (포인트 적립 및 사용)</h5>
                            <p>① 당사는 회원의 구매 활동에 따라 포인트를 부여할 수 있으며, 적립률은 당사의 정책에 따라 변경될 수 있습니다.</p>
                            <p>② 적립된 포인트는 1포인트당 1원으로 환산하여 사용 가능하며, 최소 사용 단위는 당사 정책에 따릅니다.</p>
                            <p>③ 회원이 탈퇴하거나 자격이 상실되는 경우, 적립된 포인트는 자동 소멸됩니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제7조 (저작권의 귀속 및 이용제한)</h5>
                            <p>① 당사가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 당사에 귀속합니다.</p>
                            <p>② 이용자는 서비스를 이용함으로써 얻은 정보를 당사의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제8조 (분쟁해결)</h5>
                            <p>당사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치.운영합니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">제9조 (관할법원 및 준거법)</h5>
                            <p>서비스 이용과 관련하여 발생한 분쟁에 대한 소송은 대한민국 법령을 적용하며, 민사소송법상의 관할법원에 제기합니다.</p>

                            <h5 className="font-bold text-foreground mt-6 text-base">부칙</h5>
                            <p>본 약관은 2026년 1월 1일부터 시행됩니다.</p>
                            <p className="mt-4 text-right font-medium">시행일자: 2026년 1월 1일</p>
                        </div>
                    )
                };
            case "/business-info":
                return {
                    title: "사업자 정보",
                    subtitle: "투명하고 정직한 운영을 약속합니다.",
                    content: (
                        <div className="bg-secondary p-8 rounded-lg space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">상호명</span>
                                    <span className="font-medium">주식회사 신화베이커리</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">대표자</span>
                                    <span className="font-medium">유해숙</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">사업자등록번호</span>
                                    <span className="font-medium">127-88-03260</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">법인등록번호</span>
                                    <span className="font-medium">285011-0546305</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">소재지</span>
                                    <span className="font-medium">경기도 고양시 일산동구 장진천길 46번길 22-45, 1동 (설문동)</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">통신판매업신고번호</span>
                                    <span className="font-medium">2023-경기고양-1234</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">고객센터</span>
                                    <span className="font-medium">031-938-2590</span>
                                </div>
                                <div>
                                    <span className="block text-sm text-gray-500 mb-1">이메일</span>
                                    <span className="font-medium">yhs85844@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    )
                };
            default:
                return {
                    title: "페이지를 찾을 수 없습니다",
                    subtitle: "",
                    content: <p>요청하신 페이지가 존재하지 않습니다.</p>
                };
        }
    };

    const { title, subtitle, content } = getContent();

    // SEO 데이터 선택
    const getSEOData = () => {
        switch (location) {
            case "/faq":
                return seoData.faq;
            case "/shipping":
                return seoData.shipping;
            case "/returns":
                return seoData.returns;
            case "/privacy":
                return seoData.privacy;
            case "/terms":
                return seoData.terms;
            default:
                return seoData.faq;
        }
    };

    const seo = getSEOData();

    return (
        <>
            <PageSEO
                title={seo.title}
                description={seo.description}
                keywords={seo.keywords}
            />
            <div className="pt-40 pb-20 bg-background min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">
                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl font-bold font-montserrat mb-4">{title}</h1>
                    <p className="text-muted-foreground font-pretendard">{subtitle}</p>
                </motion.div>

                <motion.div
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="font-pretendard"
                >
                    {content}
                </motion.div>
            </div>
        </div>
        </>
    );
};

export default Support;
