import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  schoolName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e40af',
  },
  schoolMotto: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 5,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#374151',
  },
  studentInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
  },
  studentInfoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  studentInfoLabel: {
    width: 120,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  studentInfoValue: {
    fontSize: 10,
    color: '#1f2937',
    flex: 1,
  },
  table: {
    display: 'flex',
    width: 'auto',
    marginTop: 15,
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 5,
  },
  tableHeaderCell: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 8,
  },
  tableCell: {
    fontSize: 9,
    textAlign: 'center',
    color: '#374151',
  },
  subjectCol: { width: '25%' },
  caCol: { width: '15%' },
  examCol: { width: '15%' },
  totalCol: { width: '15%' },
  gradeCol: { width: '15%' },
  remarkCol: { width: '15%' },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0fdf4',
    borderRadius: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  summaryLabel: {
    width: 150,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#166534',
  },
  summaryValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#166534',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  rankBadge: {
    backgroundColor: '#fbbf24',
    padding: 4,
    borderRadius: 20,
    textAlign: 'center',
    width: 80,
  },
  rankText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
  },
})

interface ReportCardProps {
  student: any
  scores: any[]
  classRank: number
  totalStudents: number
  schoolYear: string
  term: string
}

export default function ReportCardPDF({ student, scores, classRank, totalStudents, schoolYear, term }: ReportCardProps) {
  // Calculate totals
  const totalMarks = scores.reduce((sum: number, s: any) => sum + s.marks, 0)
  const averageScore = scores.length > 0 ? totalMarks / scores.length : 0
  
  // Get grade
  const getGrade = (marks: number) => {
    if (marks >= 80) return { letter: 'A', remarks: 'Excellent' }
    if (marks >= 70) return { letter: 'B', remarks: 'Very Good' }
    if (marks >= 60) return { letter: 'C', remarks: 'Good' }
    if (marks >= 50) return { letter: 'D', remarks: 'Pass' }
    return { letter: 'F', remarks: 'Fail' }
  }
  
  const overallGrade = getGrade(averageScore)
  
  // Group scores by subject
  const subjectMap = new Map()
  scores.forEach((score: any) => {
    const subjectName = score.subject?.name || 'Unknown'
    if (!subjectMap.has(subjectName)) {
      subjectMap.set(subjectName, { ca: 0, exam: 0 })
    }
    const subject = subjectMap.get(subjectName)
    if (score.assessmentType === 'CA') {
      subject.ca = score.marks
    } else if (score.assessmentType === 'EXAM') {
      subject.exam = score.marks
    }
  })
  
  const subjectScores = Array.from(subjectMap.entries()).map(([name, data]: [string, any]) => ({
    subject: name,
    ca: data.ca || 0,
    exam: data.exam || 0,
    total: data.ca && data.exam ? (data.ca + data.exam) / 2 : data.ca || data.exam || 0,
    grade: getGrade(data.ca && data.exam ? (data.ca + data.exam) / 2 : data.ca || data.exam || 0),
  }))

  const rankText = classRank === 1 ? '🥇 1st' : classRank === 2 ? '🥈 2nd' : classRank === 3 ? '🥉 3rd' : `${classRank}th`

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>IKONEX ACADEMY</Text>
          <Text style={styles.schoolMotto}>Excellence in Education</Text>
          <Text style={styles.reportTitle}>STUDENT REPORT CARD</Text>
          <Text style={styles.reportTitle}>
            {schoolYear} - {term}
          </Text>
        </View>

        {/* Student Information */}
        <View style={styles.studentInfo}>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Student Name:</Text>
            <Text style={styles.studentInfoValue}>{student.name}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Admission Number:</Text>
            <Text style={styles.studentInfoValue}>{student.admissionNo}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Class:</Text>
            <Text style={styles.studentInfoValue}>{student.classStream?.name}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Class Position:</Text>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>
                {rankText} / {totalStudents}
              </Text>
            </View>
          </View>
        </View>

        {/* Results Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.subjectCol]}>SUBJECT</Text>
            <Text style={[styles.tableHeaderCell, styles.caCol]}>CA (%)</Text>
            <Text style={[styles.tableHeaderCell, styles.examCol]}>EXAM (%)</Text>
            <Text style={[styles.tableHeaderCell, styles.totalCol]}>TOTAL (%)</Text>
            <Text style={[styles.tableHeaderCell, styles.gradeCol]}>GRADE</Text>
            <Text style={[styles.tableHeaderCell, styles.remarkCol]}>REMARK</Text>
          </View>

          {/* Table Rows */}
          {subjectScores.map((subject, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.subjectCol]}>{subject.subject}</Text>
              <Text style={[styles.tableCell, styles.caCol]}>{subject.ca || '-'}</Text>
              <Text style={[styles.tableCell, styles.examCol]}>{subject.exam || '-'}</Text>
              <Text style={[styles.tableCell, styles.totalCol]}>{subject.total.toFixed(2)}</Text>
              <Text style={[styles.tableCell, styles.gradeCol]}>{subject.grade.letter}</Text>
              <Text style={[styles.tableCell, styles.remarkCol]}>{subject.grade.remarks}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Marks Obtained:</Text>
            <Text style={styles.summaryValue}>{totalMarks}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Average Score:</Text>
            <Text style={styles.summaryValue}>{averageScore.toFixed(2)}%</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Overall Grade:</Text>
            <Text style={styles.summaryValue}>{overallGrade.letter}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remark:</Text>
            <Text style={styles.summaryValue}>{overallGrade.remarks}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Ikonex Academy Management System | {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  )
}