"use client"
import { PlusCircle, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { DatePicker } from "./date-picker"

type Rule = {
  id: string
  type: "condition" | "group"
  attribute?: string
  operator?: string
  value?: string | number | Date
  logic?: "and" | "or"
  rules?: Rule[]
}

type SegmentBuilderProps = {
  rules: Rule[]
  setRules: (rules: Rule[]) => void
}

export function SegmentBuilder({ rules, setRules }: SegmentBuilderProps) {
  const addCondition = (parentRules: Rule[], logic?: "and" | "or") => {
    const newCondition: Rule = {
      id: Date.now().toString(),
      type: "condition",
      attribute: "Total Spend",
      operator: "greater_than",
      value: "",
      logic,
    }

    return [...parentRules, newCondition]
  }

  const addGroup = (parentRules: Rule[]) => {
    const newGroup: Rule = {
      id: Date.now().toString(),
      type: "group",
      logic: "and",
      rules: [
        {
          id: (Date.now() + 1).toString(),
          type: "condition",
          attribute: "Total Spend",
          operator: "greater_than",
          value: "",
        },
      ],
    }

    return [...parentRules, newGroup]
  }

  const updateRule = (id: string, field: string, value: any, parentRules: Rule[] = rules): Rule[] => {
    return parentRules.map((rule) => {
      if (rule.id === id) {
        return { ...rule, [field]: value }
      }
      if (rule.type === "group" && rule.rules) {
        return { ...rule, rules: updateRule(id, field, value, rule.rules) }
      }
      return rule
    })
  }

  const removeRule = (id: string, parentRules: Rule[] = rules): Rule[] => {
    return parentRules.filter((rule) => {
      if (rule.id === id) {
        return false
      }
      if (rule.type === "group" && rule.rules) {
        rule.rules = removeRule(id, rule.rules)
      }
      return true
    })
  }

  const renderRuleInput = (rule: Rule) => {
    if (rule.attribute === "Last Purchase Date") {
      return <DatePicker date={rule.value as Date} onSelect={(date) => setRules(updateRule(rule.id, "value", date))} />
    }

    return (
      <Input
        type={rule.attribute === "Total Spend" || rule.attribute === "Visit Count" ? "number" : "text"}
        value={rule.value?.toString() || ""}
        onChange={(e) => setRules(updateRule(rule.id, "value", e.target.value))}
        placeholder="Enter value"
      />
    )
  }

  const renderRule = (rule: Rule, index: number, parentRules: Rule[], isNested = false) => {
    if (rule.type === "condition") {
      return (
        <div key={rule.id} className={`flex flex-wrap items-center gap-2 ${isNested ? "ml-6" : ""}`}>
          {index > 0 && (
            <Select
              value={rule.logic || "and"}
              onValueChange={(value) => setRules(updateRule(rule.id, "logic", value))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="and">AND</SelectItem>
                <SelectItem value="or">OR</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select value={rule.attribute} onValueChange={(value) => setRules(updateRule(rule.id, "attribute", value))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Total Spend">Total Spend</SelectItem>
              <SelectItem value="Visit Count">Visit Count</SelectItem>
              <SelectItem value="Last Purchase Date">Last Purchase Date</SelectItem>
            </SelectContent>
          </Select>

          <Select value={rule.operator} onValueChange={(value) => setRules(updateRule(rule.id, "operator", value))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="greater_than">Greater than</SelectItem>
              <SelectItem value="less_than">Less than</SelectItem>
              <SelectItem value="equals">Equals</SelectItem>
              {rule.attribute === "Last Purchase Date" && (
                <>
                  <SelectItem value="before">Before</SelectItem>
                  <SelectItem value="after">After</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>

          {renderRuleInput(rule)}

          <Button variant="ghost" size="icon" onClick={() => setRules(removeRule(rule.id))}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    if (rule.type === "group" && rule.rules) {
      return (
        <div key={rule.id} className={`mt-2 ${isNested ? "ml-6" : ""}`}>
          {index > 0 && (
            <div className="mb-2">
              <Select
                value={rule.logic || "and"}
                onValueChange={(value) => setRules(updateRule(rule.id, "logic", value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="and">AND</SelectItem>
                  <SelectItem value="or">OR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Card>
            <CardContent className="p-4">
              {rule.rules?.map((nestedRule, nestedIndex) => 
                renderRule(nestedRule, nestedIndex, rule.rules || [], true)
              )}

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const updatedRules = [...rules]
                    const groupToUpdate = updatedRules.find((r) => r.id === rule.id)
                    if (groupToUpdate && groupToUpdate.rules) {
                      groupToUpdate.rules = addCondition(
                        groupToUpdate.rules,
                        groupToUpdate.rules.length > 0 ? "and" : undefined,
                      )
                      setRules(updatedRules)
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Condition
                </Button>

                <Button variant="ghost" size="icon" onClick={() => setRules(removeRule(rule.id))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-4">
      {rules.map((rule, index) => renderRule(rule, index, rules))}

      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={() => setRules(addCondition(rules, rules.length > 0 ? "and" : undefined))}>
          <Plus className="h-4 w-4 mr-1" /> Add Condition
        </Button>

        <Button variant="outline" onClick={() => setRules(addGroup(rules))}>
          <PlusCircle className="h-4 w-4 mr-1" /> Add Group
        </Button>
      </div>
    </div>
  )
}
