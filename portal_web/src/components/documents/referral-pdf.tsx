// src/components/documents/referral-pdf.tsx
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Регистрируем шрифт (без изменений)
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Roboto", fontSize: 12 },
  header: { textAlign: "center", marginBottom: 20, fontSize: 18, fontWeight: "bold", textTransform: "uppercase" },
  section: { marginBottom: 10, lineHeight: 1.5 },
  footer: { marginTop: 50, flexDirection: "row", justifyContent: "space-between" },
  signature: { borderTopWidth: 1, borderTopColor: "#000", width: 150, textAlign: "center", marginTop: 10, paddingTop: 5 },
});

// 1. Добавляем documentNumber в интерфейс пропсов
export interface ReferralPDFProps {
  studentName: string;
  group: string;
  companyName: string;
  vacancyTitle: string;
  date: Date;
  documentNumber: string; // <--- Новое поле
}

// 2. Используем его в компоненте
export const ReferralPDF = ({ 
  studentName, 
  group, 
  companyName, 
  vacancyTitle, 
  date,
  documentNumber 
}: ReferralPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Направление на практику</Text>

      <View style={{ marginBottom: 30 }}>
        {/* Используем переданный проп, а не Math.random() */}
        <Text>Исх. № {documentNumber}</Text>
        <Text>Дата: {date.toLocaleDateString("ru-RU")}</Text>
      </View>

      <View style={styles.section}>
        <Text>Настоящим направляется студент группы {group || "_______"}</Text>
        <Text style={{ fontSize: 14, marginVertical: 10 }}>{studentName}</Text>
        <Text>для прохождения производственной практики в организацию:</Text>
        <Text style={{ fontSize: 14, marginVertical: 10 }}>{companyName}</Text>
      </View>

      <View style={styles.section}>
        <Text>Позиция/Должность: {vacancyTitle}</Text>
      </View>

      <View style={styles.section}>
        <Text>
          Просим обеспечить студенту необходимые условия для выполнения программы практики
          и назначить руководителя от организации.
        </Text>
      </View>

      <View style={styles.footer}>
        <View>
          <Text>Декан факультета</Text>
          <Text style={styles.signature}>(Подпись)</Text>
        </View>
        <View>
          <Text>М.П.</Text>
        </View>
      </View>
    </Page>
  </Document>
);